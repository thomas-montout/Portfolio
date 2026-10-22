import { Link } from "react-router-dom";
import { useSpotlight } from "../hooks/useSpotlight";
import SectionTitle from "../components/SectionTitle";

// Page Identité numérique (route /identite-numerique).
// Compétence du BTS visée : « Organiser son développement professionnel → Gérer son
// identité professionnelle ». Trois parties : mes profils, une identité cohérente, la protéger.
// Même principe que les autres pages : les données en tableaux typés, le JSX ne fait que du rendu.

type Profil = {
  nom: string;
  icon: string; // classe Font Awesome
  adresse: string; // texte affiché (sans https://)
  href: string;
  role: string; // ce que ce profil montre de moi
};

const profils: Profil[] = [
  {
    nom: "Portfolio",
    icon: "fa-solid fa-globe",
    adresse: "thomas-montout.vercel.app",
    href: "https://thomas-montout.vercel.app/",
    role: "Ma vitrine principale : parcours, compétences, projets E5 / E6 et veille technologique.",
  },
  {
    nom: "LinkedIn",
    icon: "fa-brands fa-linkedin",
    adresse: "linkedin.com/in/thomas-montout",
    href: "https://www.linkedin.com/in/thomas-montout",
    role: "Mon réseau professionnel : formation, alternance chez Coface et contact avec les recruteurs.",
  },
  {
    nom: "GitHub",
    icon: "fa-brands fa-github",
    adresse: "github.com/thomas-montout",
    href: "https://github.com/thomas-montout",
    role: "Le code de mes projets, avec leur README et leur historique de commits.",
  },
  {
    nom: "E-mail",
    icon: "fa-solid fa-envelope",
    adresse: "montout-thomas@hotmail.fr",
    href: "mailto:montout-thomas@hotmail.fr",
    role: "Mon adresse de contact professionnelle, affichée sur chaque page du portfolio.",
  },
];

// Ce qui rend l'identité cohérente d'un profil à l'autre.
const coherence: string[] = [
  "Le même identifiant « thomas-montout » sur GitHub, LinkedIn et l'adresse du portfolio : on me retrouve d'un site à l'autre.",
  "Chaque profil renvoie vers les autres : le pied de page du portfolio mène à GitHub, LinkedIn et mon e-mail.",
  "Mes projets GitHub sont documentés (README) et liés depuis les pages Projets E5 et E6.",
];

// Ce que je fais pour protéger mes données.
const protection: string[] = [
  "Aucun numéro de téléphone ni adresse postale publiés : on me contacte par e-mail ou par le formulaire de contact.",
  "Comptes personnels et comptes professionnels séparés.",
  "Double authentification activée sur mes comptes professionnels.",
  "Une alerte Google sur mon nom pour savoir ce qui se publie sur moi.",
];

// Carte d'un profil : un sous-composant pour appeler useSpotlight une fois par carte.
function ProfilCard({ profil }: { profil: Profil }) {
  const { ref, onMouseMove } = useSpotlight<HTMLAnchorElement>();
  // mailto: ne s'ouvre pas dans un nouvel onglet ; les sites web, si.
  const externe = profil.href.startsWith("http");

  return (
    <a
      ref={ref}
      onMouseMove={onMouseMove}
      href={profil.href}
      className="profil-card spotlight"
      {...(externe && { target: "_blank", rel: "noopener noreferrer" })}
    >
      <i className={`profil-card__icon ${profil.icon}`} aria-hidden="true" />
      <span className="profil-card__nom">{profil.nom}</span>
      <span className="profil-card__adresse">{profil.adresse}</span>
      <span className="profil-card__role">{profil.role}</span>
    </a>
  );
}

export default function IdentiteNumerique() {
  return (
    <section className="identite_section">
      <div className="identite_container">
        <SectionTitle>Identité numérique</SectionTitle>
        <p className="subsection-intro">
          Mon identité numérique, ce sont toutes les traces que je laisse en ligne. Je la construis
          pour qu'un recruteur trouve, en quelques clics, une image claire et cohérente de mon
          parcours de développeur.
        </p>

        <h3 className="subsection_title">
          <span>Mes profils professionnels</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {profils.map((p) => (
            <ProfilCard key={p.nom} profil={p} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="mini-card">
            <h4>
              <i className="fa-solid fa-link" /> Une identité cohérente
            </h4>
            <ul className="veille-list">
              {coherence.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div className="mini-card">
            <h4>
              <i className="fa-solid fa-user-shield" /> Protéger mes données
            </h4>
            <ul className="veille-list">
              {protection.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className="subsection-intro">
          Pour me joindre directement : <Link to="/contact">formulaire de contact</Link>.
        </p>
      </div>
    </section>
  );
}
