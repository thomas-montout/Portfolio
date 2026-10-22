import { useSpotlight } from "../hooks/useSpotlight";
import SectionTitle from "../components/SectionTitle";
import RssFeed from "../components/RssFeed";
import Vignette from "../components/Vignette";
import {
  type Article,
  type Categorie,
  articles,
  etapes,
  outils,
  sources,
  sujet,
} from "../data/veille";

// Page Veille technologique (route /veille-technologique).
// Ordre de lecture : le sujet et ses 3 étapes → mes articles analysés, rangés par étape
// → mes outils et sources, avec le flux RSS en direct (la matière brute avant ma sélection).
// Toutes les données viennent de data/veille.ts : ce fichier ne fait que de l'affichage.

// "2026-09-29" → "29 sept. 2026" (mois abrégé : la carte reste sur une ligne).
// timeZone "UTC" : une date ISO sans heure est lue comme minuit UTC. Sans cette option,
// un visiteur à l'ouest de Greenwich (Canada…) verrait la veille, le 28.
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

// Icône affichée à la place de la vignette si l'image de l'article ne se charge pas.
// Record<Categorie, string> : TS vérifie qu'aucune catégorie n'est oubliée.
const iconesCategorie: Record<Categorie, string> = {
  ARCHITECTURE: "fa-solid fa-sitemap",
  TECHNIQUE: "fa-solid fa-code",
  STANDARD: "fa-solid fa-plug",
  SÉCURITÉ: "fa-solid fa-shield-halved",
  GOUVERNANCE: "fa-solid fa-scale-balanced",
};

// Carte compacte : vignette, média + date, titre, enjeu en une phrase, lien.
// Le résumé complet reste disponible mais replié (<details>) pour ne pas surcharger la carte.
// Sous-composant pour appeler useSpotlight une fois PAR carte (un hook ne s'appelle pas dans un .map()).
// <article> plutôt que <div> : balise sémantique pour un contenu autonome.
function VeilleCard({ article }: { article: Article }) {
  const { ref, onMouseMove } = useSpotlight<HTMLElement>();

  return (
    <article
      ref={ref}
      onMouseMove={onMouseMove}
      className={`veille-card spotlight ${article.aLaUne ? "veille-card--une" : ""}`}
    >
      {/* La vignette mène aussi à l'article. tabIndex={-1} + aria-hidden : le clavier et les
          lecteurs d'écran passent directement au lien « Lire l'article », sans doublon. */}
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="veille-card__thumb"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Vignette src={article.image} icon={iconesCategorie[article.categorie]} />
        {article.aLaUne && <span className="veille-card__badge">À la une</span>}
      </a>

      <div className="veille-card__body">
        <p className="veille-card__meta">
          {article.source} ·{" "}
          {/* <time dateTime> : date lisible par les machines, texte lisible par les humains */}
          <time dateTime={article.date}>{formatDate(article.date)}</time>
        </p>
        <h4 className="veille-card__title">{article.titre}</h4>
        <p className="veille-card__why">
          <strong>Enjeu :</strong> {article.pourquoi}
        </p>

        {/* <details> / <summary> : bloc repliable natif du navigateur, sans JavaScript. */}
        <details className="veille-card__details">
          <summary>Résumé</summary>
          <p>{article.resume}</p>
          {article.voirAussi && (
            <a href={article.voirAussi.url} target="_blank" rel="noopener noreferrer">
              Voir aussi : {article.voirAussi.titre} ({article.voirAussi.source})
            </a>
          )}
        </details>

        {/* title = infobulle au survol : le titre d'origine reste consultable (traçabilité). */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="veille-card__link"
          title={article.titreOriginal}
        >
          Lire l'article <i className="fa-solid fa-arrow-up-right-from-square" />
        </a>
      </div>
    </article>
  );
}

export default function VeilleTechnologique() {
  return (
    <section className="veille_technologique_section">
      <div className="veille_technologique_container">
        <SectionTitle>Veille technologique</SectionTitle>

        {/* 1. Le sujet : titre court, question, puis les 3 étapes qui structurent toute la page. */}
        <div className="veille-hero">
          <span className="veille-hero__label">Mon sujet de veille</span>
          <h3 className="veille-hero__titre">{sujet.titre}</h3>
          <p className="veille-hero__question">{sujet.question}</p>
          <ol className="veille-steps">
            {etapes.map((e, i) => (
              <li key={e.id} className="veille-step">
                <i className={`veille-step__icon ${e.icon}`} aria-hidden="true" />
                <span className="veille-step__titre">
                  {i + 1}. {e.titre} <span className="veille-step__theme">{e.theme}</span>
                </span>
                <span className="veille-step__texte">{e.texte}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* 2. Les articles, groupés par étape (ordre chronologique dans chaque étape). */}
        <h3 className="subsection_title">
          <span>Mes articles analysés ({articles.length})</span>
        </h3>
        {etapes.map((e, i) => (
          <div key={e.id} className="veille-etape">
            <h4 className="veille-etape__titre">
              <span className="veille-etape__num">{i + 1}</span>
              {e.titre}
              <span className="veille-step__theme">{e.theme}</span>
            </h4>
            <div className="veille-grid">
              {articles
                .filter((a) => a.etape === e.id)
                .map((a) => (
                  <VeilleCard key={a.url} article={a} />
                ))}
            </div>
          </div>
        ))}

        {/* 3. Outils et sources, puis le flux RSS en direct de ces sources. */}
        <h3 className="subsection_title">
          <span>Mes outils et mes sources</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
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
        <RssFeed />
      </div>
    </section>
  );
}
