import { useEffect, useState } from "react";
import { useSpotlight } from "../hooks/useSpotlight";
import SectionTitle from "../components/SectionTitle";
import {
  type Article,
  articlesALaUne,
  articlesParAxe,
  axes,
  outils,
  sources,
} from "../data/veille";

// Section Veille technologique (ancre #veille, entre Missions et Contact sur la home).
// Ordre de lecture : le sujet → mes outils et sources → le flux en direct →
// « À la une » (les 2 articles les plus récents) → mes analyses, rangées par axe.
// Toutes les données viennent de data/veille.ts : ce fichier ne fait que de l'affichage.

// ─── Widget RSS.app ───
// C'est un "Web Component" : le script de RSS.app apprend au navigateur une nouvelle
// balise, <rssapp-carousel>, qui se remplit toute seule avec les articles du flux.
const RSS_APP_SCRIPT = "https://widget.rss.app/v1/carousel.js";
const RSS_APP_WIDGET_ID = "_PQBxJNfAb8L5PRoX"; // identifiant de mon flux, fourni par RSS.app

// TypeScript connaît les balises HTML standard, mais pas <rssapp-carousel>.
// On l'ajoute à la liste des balises JSX autorisées (IntrinsicElements),
// avec les mêmes attributs qu'un élément HTML classique (id, className…).
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "rssapp-carousel": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

// "2026-09-29" → "29 septembre 2026".
// timeZone "UTC" : une date ISO sans heure est lue comme minuit UTC. Sans cette option,
// un visiteur à l'ouest de Greenwich (Canada…) verrait la veille, le 28.
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

// Une fiche article. Sous-composant pour appeler useSpotlight une fois PAR carte
// (un hook ne s'appelle pas dans un .map()).
// <article> plutôt que <div> : balise sémantique pour un contenu autonome.
// showAxe : affiche le badge de l'axe, utile seulement dans « À la une ».
function VeilleCard({ article, showAxe = false }: { article: Article; showAxe?: boolean }) {
  const { ref, onMouseMove } = useSpotlight<HTMLElement>();
  // Passe à true si l'image ne se charge pas (lien cassé, site du média en panne…).
  const [imageEnErreur, setImageEnErreur] = useState(false);
  // find() renvoie le premier axe dont la clé correspond (ou undefined).
  const axe = axes.find((x) => x.key === article.axe);

  return (
    <article ref={ref} onMouseMove={onMouseMove} className="veille-card spotlight">
      {/* L'image de l'article si elle existe et se charge, sinon un visuel avec l'icône de l'axe.
          alt="" : image décorative, le titre juste en dessous dit déjà de quoi parle la fiche.
          loading="lazy" : le navigateur ne la télécharge qu'à l'approche de la carte. */}
      {article.image && !imageEnErreur ? (
        <img
          src={article.image}
          alt=""
          loading="lazy"
          onError={() => setImageEnErreur(true)}
          className="veille-card__img"
        />
      ) : (
        <div className="veille-card__img veille-card__img--placeholder" aria-hidden="true">
          <i className={axe?.icon} />
        </div>
      )}

      <div className="veille-card__body">
        <div className="veille-card__meta">
          <span className="veille-card__source">{article.source}</span>
          {/* <time dateTime> : date lisible par les machines, texte lisible par les humains */}
          <time dateTime={article.date}>{formatDate(article.date)}</time>
          {showAxe && axe && <span className="veille-card__axe">{axe.label}</span>}
        </div>
        <h4 className="veille-card__title">{article.title}</h4>
        <p className="veille-card__resume">{article.resume}</p>
        <p className="veille-card__why">
          <strong>Pourquoi c'est important :</strong> {article.pourquoi}
        </p>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="veille-card__link"
        >
          Lire l'article <i className="fa-solid fa-arrow-up-right-from-square" />
        </a>
      </div>
    </article>
  );
}

export default function VeilleTechnologique({ id = "veille" }: { id?: string }) {
  // Charge le script RSS.app une seule fois.
  // Pourquoi pas un <script> dans le JSX ? React 18 l'insère dans la page sans l'exécuter.
  useEffect(() => {
    // Déjà présent (retour sur la home, ou double montage du StrictMode en dev) → on s'arrête :
    // une balise personnalisée ne peut être déclarée qu'une seule fois.
    if (document.querySelector(`script[src="${RSS_APP_SCRIPT}"]`)) return;
    const script = document.createElement("script");
    script.src = RSS_APP_SCRIPT;
    script.async = true; // téléchargé en arrière-plan, ne bloque pas l'affichage
    document.body.appendChild(script);
    // Pas de cleanup : retirer la balise <script> n'annulerait pas le code déjà exécuté.
  }, []);

  return (
    <section id={id} className="veille_technologique_section">
      <div className="veille_technologique_container">
        <SectionTitle>Veille technologique</SectionTitle>

        {/* 1. Le sujet */}
        <p className="veille-sujet">
          Comment les entreprises intègrent-elles les LLM dans leurs logiciels&nbsp;?
        </p>
        <p className="veille-intro">
          Les LLM (grands modèles de langage, comme ceux derrière ChatGPT ou Le Chat de Mistral)
          sortent des fenêtres de discussion : les éditeurs les intègrent directement dans leurs
          logiciels. Je suis comment ils s'y prennent, et avec quelles précautions.
        </p>

        {/* 2. Outils et sources */}
        <h3 className="subsection_title">
          <span>Mes outils et mes sources</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="mini-card">
            <h4>
              <i className="fa-solid fa-toolbox" /> Outils
            </h4>
            <ul className="veille-list">
              {outils.map((o) => (
                <li key={o.nom}>
                  <strong>{o.nom}</strong> : {o.role}
                </li>
              ))}
            </ul>
          </div>
          <div className="mini-card">
            <h4>
              <i className="fa-solid fa-newspaper" /> Sources
            </h4>
            <ul className="veille-list">
              {sources.map((s) => (
                <li key={s.nom}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.nom}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3. Le flux en direct */}
        <h3 className="subsection_title">
          <span>Le flux en direct</span>
        </h3>
        <p className="veille-intro">
          Les derniers articles de mes sources, mis à jour automatiquement.
        </p>
        <div className="veille-feed">
          <rssapp-carousel id={RSS_APP_WIDGET_ID} />
        </div>

        {/* 4. À la une */}
        <h3 className="subsection_title">
          <span>À la une</span>
        </h3>
        <p className="veille-intro">Les deux articles les plus récents de ma veille.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {articlesALaUne.map((a) => (
            <VeilleCard key={a.url} article={a} showAxe />
          ))}
        </div>

        {/* 5. Mes analyses, par axe */}
        {axes.map((axe, i) => (
          <div key={axe.key}>
            <h3 className="subsection_title">
              <span>
                Axe {i + 1} · {axe.title}
              </span>
            </h3>
            <p className="veille-intro">{axe.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {articlesParAxe(axe.key).map((a) => (
                <VeilleCard key={a.url} article={a} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
