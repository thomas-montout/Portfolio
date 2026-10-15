import { useSpotlight } from "../hooks/useSpotlight";
import SectionTitle from "../components/SectionTitle";
import RssFeed from "../components/RssFeed";
import Vignette from "../components/Vignette";
import { type Article, type Categorie, articles, outils, sources } from "../data/veille";

// Page Veille technologique (route /veille-technologique).
// Ordre de lecture : le sujet → le flux RSS en direct (preuve que la veille est automatisée)
// → mes articles analysés, dans l'ordre chronologique → mes outils et sources.
// Toutes les données viennent de data/veille.ts : ce fichier ne fait que de l'affichage.

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

// Icône affichée à la place de la vignette si l'image de l'article ne se charge pas.
// Record<Categorie, string> : TS vérifie qu'aucune catégorie n'est oubliée.
const iconesCategorie: Record<Categorie, string> = {
  ARCHITECTURE: "fa-solid fa-sitemap",
  TECHNIQUE: "fa-solid fa-code",
  STANDARD: "fa-solid fa-plug",
  SÉCURITÉ: "fa-solid fa-shield-halved",
  GOUVERNANCE: "fa-solid fa-scale-balanced",
};

// Une fiche article : la vignette à gauche (au-dessus en mobile), puis toujours dans le même
// ordre : média + date (et catégorie à droite), titre, résumé, un trait,
// « Pourquoi c'est important », puis le lien vers l'article d'origine.
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
      </a>

      <div className="veille-card__body">
        <div className="veille-card__head">
          <span className="veille-card__source">{article.source}</span>
          {/* <time dateTime> : date lisible par les machines, texte lisible par les humains */}
          <time dateTime={article.date} className="veille-card__date">
            {formatDate(article.date)}
          </time>
          {/* Groupe poussé tout à droite de la ligne (margin-left: auto dans le CSS). */}
          <span className="veille-card__tags">
            {article.aLaUne && <span className="veille-card__badge">À la une</span>}
            <span className="veille-card__categorie">{article.categorie}</span>
          </span>
        </div>

        <h4 className="veille-card__title">{article.titre}</h4>
        <p className="veille-card__resume">{article.resume}</p>
        <p className="veille-card__why">
          <strong>Pourquoi c'est important :</strong> {article.pourquoi}
        </p>

        <div className="veille-card__footer">
          {/* title = infobulle au survol : le titre d'origine reste consultable (traçabilité)
            sans alourdir la fiche. */}
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="veille-card__link"
            title={article.titreOriginal}
          >
            Lire l'article <i className="fa-solid fa-arrow-up-right-from-square" />
          </a>
          {article.voirAussi && (
            <a
              href={article.voirAussi.url}
              target="_blank"
              rel="noopener noreferrer"
              className="veille-card__see-also"
            >
              Voir aussi : {article.voirAussi.titre} ({article.voirAussi.source})
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function VeilleTechnologique() {
  return (
    <section className="veille_technologique_section">
      <div className="veille_technologique_container">
        <SectionTitle>Veille technologique</SectionTitle>

        {/* 1. Le sujet */}
        <p className="veille-sujet">
          Du RAG aux agents IA autonomes : comment sécuriser des IA qui agissent sur le système
          d'information de l'entreprise&nbsp;?
        </p>
        <p className="veille-intro">
          Le RAG (Retrieval-Augmented Generation) permet à une IA de répondre à partir des documents
          de l'entreprise. En un an, ces systèmes sont passés de la simple recherche de documents à
          des agents qui appellent des API et exécutent du code. Je suis cette évolution, et les
          solutions qui apparaissent pour les encadrer.
        </p>

        {/* 2. Le flux en direct : indépendant des fiches, il prouve que la veille tourne seule. */}
        <RssFeed />

        {/* 3. Les fiches, dans l'ordre chronologique */}
        <h3 className="subsection_title">
          <span>Le fil de ma veille : {articles.length} articles analysés</span>
        </h3>
        <p className="veille-intro">
          Du RAG « naïf » qui se contente de chercher, jusqu'aux agents isolés par le système
          d'exploitation : les étapes clés, de la plus ancienne à la plus récente.
        </p>
        <ol className="veille-timeline">
          {articles.map((a) => (
            <li key={a.url} className={a.aLaUne ? "is-une" : ""}>
              <VeilleCard article={a} />
            </li>
          ))}
        </ol>

        {/* 4. Outils et sources */}
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
      </div>
    </section>
  );
}
