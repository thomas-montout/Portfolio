// Fonction serverless Vercel : GET /api/rss
// Lit côté serveur les flux RSS de mes sources de veille, les fusionne et renvoie au site
// un petit JSON : { sources: [...], articles: [...] }, articles du plus récent au plus ancien.
//
// Pourquoi un intermédiaire au lieu d'un fetch direct depuis la page ?
// - Les médias n'envoient pas d'en-tête CORS : le navigateur refuse de lire leurs flux depuis notre domaine.
// - Le pare-feu du JDN bloque les requêtes qui ne s'identifient pas avec un User-Agent de type navigateur.
// - Certains flux sont lourds (ByteByteGo : ~1 Mo, avec le texte complet des articles) :
//   le serveur ne garde que titre, lien et date, le navigateur ne reçoit que quelques Ko.
// En dev (npm run dev), c'est le plugin de vite.config.ts qui appelle cette même fonction GET.
//
// Tout fichier du dossier /api est déployé par Vercel comme une fonction : pas de config à ajouter.
// Il n'est pas compilé par le build Vite : Vercel le compile lui-même (tsc le vérifie via tsconfig.node.json).

import { XMLParser } from "fast-xml-parser";

// Les flux suivis. id = clé courte, utilisée par les onglets de la page.
const SOURCES = [
  { id: "jdn", nom: "Journal du Net", url: "https://www.journaldunet.com/developpeur/rss/" },
  { id: "bytebytego", nom: "ByteByteGo", url: "https://blog.bytebytego.com/feed" },
  { id: "logrocket", nom: "LogRocket", url: "https://blog.logrocket.com/feed/" },
  { id: "tldr-ai", nom: "TLDR AI", url: "https://tldr.tech/api/rss/ai" },
];
const PAR_SOURCE = 6; // nombre d'articles gardés par flux
const USER_AGENT = "Mozilla/5.0 (compatible; portfolio-veille/1.0)";

// Ce que la page reçoit pour chaque article. date au format ISO : se trie comme du texte.
// image : absente si le flux n'en fournit pas (la page affiche alors un visuel de remplacement).
type ArticleFlux = { source: string; titre: string; lien: string; date: string; image?: string };

// Un <item> du XML, une fois converti en objet par le parseur.
type ItemRss = {
  title?: string;
  link?: string;
  pubDate?: string;
  enclosure?: { url?: string } | { url?: string }[];
  description?: string;
  "content:encoded"?: string; // contenu HTML complet de l'article (LogRocket, ByteByteGo)
};

// fast-xml-parser transforme le XML en objet JS : <item><title>…</title></item> → { title: "…" }.
// parseTagValue: false → tout reste du texte (sinon un titre comme "2026" deviendrait un nombre).
// htmlEntities: true → décode les codes du type &#039; en vrais caractères (').
// ignoreAttributes : on ne lit qu'un seul attribut, url (celui de <enclosure url="…">, l'image
// de l'article). Ignorer tous les autres garde les balises de texte en simple texte.
// attributeNamePrefix: "" → <enclosure url="…"> devient { url: "…" } au lieu de { "@_url": "…" }.
const parser = new XMLParser({
  parseTagValue: false,
  htmlEntities: true,
  ignoreAttributes: (nom) => nom !== "url",
  attributeNamePrefix: "",
});

// Image d'un article, selon ce que le flux fournit :
// 1. <enclosure url="…"> (Journal du Net, ByteByteGo) ;
// 2. sinon la première <img> du contenu HTML de l'article (LogRocket).
// TLDR AI n'en fournit aucune : la page affiche alors un visuel de remplacement.
function imageDe(item: ItemRss): string | undefined {
  // [x].flat() : qu'il y ait une ou plusieurs <enclosure>, on obtient toujours un tableau.
  const enclosure = [item.enclosure ?? []].flat()[0];
  if (enclosure?.url) return enclosure.url;
  const html = item["content:encoded"] ?? item.description ?? "";
  // Expression régulière : capture la valeur de src dans la première balise <img …>.
  return html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
}

// Télécharge UN flux et renvoie ses derniers articles. Lance une erreur si le flux ne répond pas.
async function lireFlux(source: (typeof SOURCES)[number]): Promise<ArticleFlux[]> {
  const res = await fetch(source.url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/rss+xml, application/xml, text/xml",
    },
    // Abandonne au bout de 8 s plutôt que de laisser la page attendre indéfiniment.
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`${source.nom} : HTTP ${res.status}`);

  // Structure d'un flux RSS : <rss><channel><item>…</item><item>…</item></channel></rss>.
  // ?. et ?? : si une balise manque, on obtient un tableau vide au lieu d'un plantage.
  const items: ItemRss | ItemRss[] = parser.parse(await res.text())?.rss?.channel?.item ?? [];
  // Un flux avec un seul <item> donne un objet, pas un tableau : on l'emballe dans un tableau.
  const liste = Array.isArray(items) ? items : [items];

  return liste
    .map((item) => ({
      source: source.id,
      titre: (item.title ?? "").trim(),
      lien: (item.link ?? source.url).trim(),
      date: new Date(item.pubDate ?? ""),
      image: imageDe(item),
    }))
    .filter((a) => a.titre && !Number.isNaN(a.date.getTime()))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, PAR_SOURCE)
    .map((a) => ({ ...a, date: a.date.toISOString() }));
}

// Mémoire du serveur : le dernier résultat réussi de chaque flux, et l'heure où on l'a obtenu.
// - Évite de redemander un flux à chaque visite : TLDR AI répond « 429 Too Many Requests »
//   dès la 3e requête rapprochée.
// - Si un flux tombe en panne, on ressert sa dernière version connue au lieu de le faire disparaître.
// Map = dictionnaire clé → valeur : ici id de la source → { quand, articles }.
// Elle vit tant que le serveur tourne (en dev : jusqu'à l'arrêt de npm run dev ;
// sur Vercel : tant que l'instance de la fonction reste « chaude »).
const memoire = new Map<string, { quand: number; articles: ArticleFlux[] }>();
const FRAICHEUR_MS = 10 * 60 * 1000; // une version de moins de 10 min est resservie telle quelle

async function lireFluxAvecMemoire(source: (typeof SOURCES)[number]): Promise<ArticleFlux[]> {
  const enMemoire = memoire.get(source.id); // undefined si le flux n'a jamais été lu
  // Version récente en mémoire → on la renvoie sans rien télécharger.
  if (enMemoire && Date.now() - enMemoire.quand < FRAICHEUR_MS) return enMemoire.articles;

  try {
    const articles = await lireFlux(source);
    memoire.set(source.id, { quand: Date.now(), articles });
    return articles;
  } catch (erreur) {
    // Flux en panne mais déjà lu une fois : une version un peu ancienne vaut mieux que rien.
    if (enMemoire) {
      console.error(`Flux ${source.nom} indisponible, dernière version resservie :`, erreur);
      return enMemoire.articles;
    }
    throw erreur; // jamais lu → l'erreur remonte, allSettled la classera en « rejected »
  }
}

export async function GET() {
  // allSettled attend TOUS les flux, qu'ils réussissent ou échouent.
  // Promise.all, lui, abandonnerait tout dès la première erreur : un seul média en panne
  // viderait le bloc entier. Ici, les autres sources s'affichent quand même.
  const resultats = await Promise.allSettled(SOURCES.map(lireFluxAvecMemoire));

  resultats.forEach((r, i) => {
    // Visible dans les logs Vercel (ou le terminal en dev) : on sait quel flux est en panne.
    if (r.status === "rejected") console.error(`Flux ${SOURCES[i].nom} indisponible :`, r.reason);
  });

  // On n'annonce à la page que les sources qui ont répondu (elles deviennent les onglets).
  const sources = SOURCES.filter((_, i) => resultats[i].status === "fulfilled");
  // flatMap : chaque résultat donne un tableau d'articles, flatMap les met bout à bout.
  const articles = resultats
    .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    .sort((a, b) => b.date.localeCompare(a.date));

  if (articles.length === 0) return new Response("Flux indisponibles", { status: 502 });

  return new Response(JSON.stringify({ sources, articles }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // Cache du CDN Vercel : les flux sont relus au plus toutes les 10 min,
      // et une version un peu ancienne peut être servie 1 h pendant la mise à jour.
      "Cache-Control": "s-maxage=600, stale-while-revalidate=3600",
    },
  });
}
