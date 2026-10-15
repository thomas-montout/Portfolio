import { useEffect, useState } from "react";
import Vignette from "./Vignette";

// Bloc « Flux RSS en direct » de la page Veille : la preuve que la veille est automatisée.
// Les flux de mes sources (Journal du Net, ByteByteGo, LogRocket, TLDR AI) sont lus à chaque
// visite (puis toutes les 10 min si la page reste ouverte), sans aucune saisie de ma part.
// Un onglet par source, plus « Tous » qui mélange les derniers articles de toutes les sources.
//
// La page n'appelle pas les médias directement mais /api/rss : la fonction serveur api/rss.ts
// lit les flux, les fusionne et renvoie un petit JSON (en dev, même fonction via vite.config.ts).

const FEED_URL = "/api/rss";
const NB_ARTICLES = 6;
const REFRESH_MS = 10 * 60 * 1000;

// Mêmes formes que ce que renvoie api/rss.ts.
type Source = { id: string; nom: string; url: string };
type ArticleFlux = { source: string; titre: string; lien: string; date: string; image?: string };
type Flux = { sources: Source[]; articles: ArticleFlux[] };
type Status = "loading" | "ok" | "error";

// Sélection de l'onglet « Tous » : on pioche À TOUR DE RÔLE dans chaque source
// (le plus récent de chacune, puis le 2e de chacune…), sinon une source qui publie tous les
// jours (ByteByteGo) remplirait les 6 cases à elle seule. Le résultat est ensuite remis par date.
function aTourDeRole(flux: Flux): ArticleFlux[] {
  // Un tableau d'articles par source : [[jdn1, jdn2…], [bbg1, bbg2…], …]
  const parSource = flux.sources.map((s) => flux.articles.filter((a) => a.source === s.id));
  const choisis: ArticleFlux[] = [];
  // i = le rang dans chaque source : 0 = son plus récent, 1 = le suivant…
  for (let i = 0; choisis.length < NB_ARTICLES && parSource.some((l) => l[i]); i++) {
    for (const liste of parSource) {
      if (liste[i] && choisis.length < NB_ARTICLES) choisis.push(liste[i]);
    }
  }
  return choisis.sort((a, b) => b.date.localeCompare(a.date));
}

// "il y a 3 jours", "il y a 2 semaines"… Intl.RelativeTimeFormat formate tout seul en français.
const rtf = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });
function depuis(date: Date): string {
  const heures = Math.round((date.getTime() - Date.now()) / 3_600_000); // négatif = passé
  if (Math.abs(heures) < 24) return rtf.format(heures, "hour");
  const jours = Math.round(heures / 24);
  if (Math.abs(jours) < 7) return rtf.format(jours, "day");
  if (Math.abs(jours) < 30) return rtf.format(Math.round(jours / 7), "week");
  return rtf.format(Math.round(jours / 30), "month");
}

export default function RssFeed() {
  const [flux, setFlux] = useState<Flux>({ sources: [], articles: [] });
  const [status, setStatus] = useState<Status>("loading");
  const [majA, setMajA] = useState<Date | null>(null);
  // Onglet choisi : "tous" ou l'id d'une source ("jdn", "bytebytego"…).
  const [actif, setActif] = useState("tous");

  useEffect(() => {
    // AbortController : annule la requête en cours si on quitte la page avant la réponse.
    const controller = new AbortController();
    const charger = async () => {
      try {
        const res = await fetch(FEED_URL, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setFlux(await res.json());
        setStatus("ok");
        setMajA(new Date());
      } catch (e) {
        if (controller.signal.aborted) return;
        console.error("Flux RSS indisponible :", e);
        // Si un rafraîchissement échoue, on garde les articles déjà affichés.
        setStatus((s) => (s === "ok" ? s : "error"));
      }
    };
    charger();
    const timer = setInterval(charger, REFRESH_MS);
    return () => {
      clearInterval(timer);
      controller.abort();
    };
  }, []);

  // Si la source choisie ne répond plus au rafraîchissement suivant, on retombe sur « Tous »
  // plutôt que d'afficher un onglet vide.
  const sourceActive = flux.sources.find((s) => s.id === actif);
  const onglet = sourceActive ? actif : "tous";
  // Onglet d'une source : ses articles arrivent déjà triés du plus récent au plus ancien,
  // on garde les 6 premiers.
  const visibles =
    onglet === "tous"
      ? aTourDeRole(flux)
      : flux.articles.filter((a) => a.source === onglet).slice(0, NB_ARTICLES);
  const nomSource = (id: string) => flux.sources.find((s) => s.id === id)?.nom ?? id;

  return (
    <div className="rss-feed">
      <div className="rss-feed__header">
        <span className={`rss-live ${status === "error" ? "is-off" : ""}`}>
          <span className="rss-live__dot" aria-hidden="true" />
          {status === "error" ? "Hors ligne" : "En direct"}
        </span>
        <div className="rss-feed__heading">
          <h3>Flux RSS en direct · Veille active</h3>
          <p>
            {/* join(", ") : ["JDN", "TLDR AI"] → "JDN, TLDR AI" */}
            {flux.sources.map((s) => s.nom).join(", ")}
            {majA &&
              ` · actualisé à ${majA.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`}
          </p>
        </div>
        {/* Lien vers le XML d'origine, seulement quand une source précise est choisie. */}
        {sourceActive && (
          <a
            href={sourceActive.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rss-feed__raw"
          >
            <i className="fa-solid fa-rss" /> Flux brut
          </a>
        )}
      </div>

      {/* Onglets : mêmes classes que la page E5 (.tabs / .tab). */}
      {status === "ok" && (
        <div className="tabs" role="tablist">
          {/* [{ id: "tous", … }, ...flux.sources] : « Tous » en premier, puis une entrée par source. */}
          {[{ id: "tous", nom: "Tous" }, ...flux.sources].map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={onglet === s.id}
              className={`tab ${onglet === s.id ? "active" : ""}`}
              onClick={() => setActif(s.id)}
            >
              {s.nom}
            </button>
          ))}
        </div>
      )}

      {status === "loading" && (
        // Squelettes de chargement : la mise en page ne "saute" pas quand les articles arrivent.
        <ul className="rss-feed__list" aria-busy="true">
          {Array.from({ length: NB_ARTICLES }, (_, i) => (
            <li key={i} className="rss-item rss-item--skeleton" />
          ))}
        </ul>
      )}

      {status === "error" && (
        <p className="rss-feed__error">Les flux sont momentanément indisponibles.</p>
      )}

      {status === "ok" && (
        <ul className="rss-feed__list">
          {visibles.map((a) => (
            <li key={a.lien}>
              <a href={a.lien} target="_blank" rel="noopener noreferrer" className="rss-item">
                {/* Miniature de l'article (ou icône journal si le flux n'en fournit pas, ex. TLDR AI). */}
                <Vignette src={a.image} icon="fa-solid fa-newspaper" className="rss-item__img" />
                <span className="rss-item__body">
                  {/* Le nom du média n'est utile que dans « Tous », où les sources sont mélangées. */}
                  {onglet === "tous" && (
                    <span className="rss-item__source">{nomSource(a.source)}</span>
                  )}
                  <span className="rss-item__title">{a.titre}</span>
                  <time dateTime={a.date} className="rss-item__date">
                    {depuis(new Date(a.date))}
                  </time>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
