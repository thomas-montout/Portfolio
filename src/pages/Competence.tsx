import { useSpotlight } from "../hooks/useSpotlight";
import SectionTitle from "../components/SectionTitle";

// Page Compétences. Idée principale : sortir les données dans des tableaux typés,
// et laisser le JSX faire UNIQUEMENT du rendu. Beaucoup plus lisible que de copier-coller
// chaque pastille à la main.
//
// RANGEMENT : on regroupe par NATURE technique.
//   1) Langages         — ce qu'on écrit soi-même (markup, code, requêtes BDD)
//   2) Frameworks & technologies — les couches déjà construites qu'on assemble
//   3) Logiciels & outils — software, OS, outils CLI utilisés autour du code
// Toutes les techs présentes dans les cards de missions sont reprises ici.
//
// AFFICHAGE : un bloc par catégorie, les 3 côte à côte en grand écran ; dans chaque bloc,
// une mini-carte par techno (icône au-dessus, nom en dessous).

// "type" = alias TS pour décrire la forme d'un objet.
// "icon" = classe CSS pour l'icône. Devicon (ex: "devicon-react-plain colored")
// ou FontAwesome (ex: "fa-solid fa-cube") — les deux marchent via le même <i>.
type Skill = {
  label: string;
  icon?: string;
  customIcon?: string;
};

// ─── Langages ───
// Tout ce qu'on tape soi-même : du markup web aux langages serveur, en passant
// par le SQL des bases de données.
const langages: Skill[] = [
  { label: "HTML5", icon: "devicon-html5-plain colored" },
  { label: "CSS3", icon: "devicon-css3-plain colored" },
  { label: "JavaScript", icon: "devicon-javascript-plain colored" },
  { label: "TypeScript", icon: "devicon-typescript-plain colored" },
  { label: "PHP", icon: "devicon-php-plain colored" },
  { label: "Python", icon: "devicon-python-plain colored" },
  { label: "MySQL", icon: "devicon-mysql-plain colored" },
  { label: "PostgreSQL", icon: "devicon-postgresql-plain colored" },
];

// ─── Frameworks & technologies ───
// Les couches "déjà construites" sur lesquelles on assemble : frameworks
// front/back, libs Python, lib de jeu, ORM, services de données.
const frameworks: Skill[] = [
  { label: "React", icon: "devicon-react-plain colored" },
  { label: "Symfony", icon: "devicon-symfony-plain colored" },
  { label: "Next.js", icon: "devicon-nextjs-plain colored" },
  { label: "Tailwind CSS", icon: "devicon-tailwindcss-plain colored" },
  { label: "Vite", icon: "devicon-vite-plain colored" },
  { label: "Bootstrap", icon: "devicon-bootstrap-plain colored" },
  { label: "Twig", customIcon: "/img/icons/logo-twig.png" },
  { label: "FastAPI", icon: "devicon-fastapi-plain colored" },
  // Quand customIcon est défini, on rend une <img> au lieu d'un <i>.
  { label: "Phaser", icon: "", customIcon: "/img/icons/phaser-logo.png" },
  { label: "Pandas", icon: "devicon-pandas-plain colored" },
  { label: "Numpy", icon: "devicon-numpy-plain colored" },
  { label: "Prisma", icon: "devicon-prisma-plain colored" },
  { label: "NeonDB", icon: "", customIcon: "/img/icons/neondb-logo.png" },
];

// ─── Logiciels & outils ───
// OS, outils de dev, virtualisation, design, et outils CLI security.
// Pour ce qui n'a pas de devicon (Burp Suite, GPG, OpenSSL, Arpspoof, DVWA,
// VirtualBox), on fallback sur FontAwesome déjà chargé via index.html.
const outils: Skill[] = [
  { label: "Git", icon: "devicon-git-plain colored" },
  { label: "GitHub", icon: "devicon-github-original" },
  { label: "Linux", icon: "devicon-linux-plain colored" },
  { label: "Apache", icon: "devicon-apache-plain colored" },
  { label: "Figma", icon: "devicon-figma-plain colored" },
  { label: "Ubuntu", icon: "devicon-ubuntu-plain colored" },
  { label: "Kali Linux", customIcon: "/img/icons/logo-kali.png" },
  { label: "Windows Server", icon: "devicon-windows8-plain colored" },
  { label: "VMware", icon: "", customIcon: "/img/icons/vmware-logo.svg" },
  { label: "OCS Inventory", icon: "", customIcon: "/img/icons/ocs-logo.png" },
  { label: "GLPI", icon: "", customIcon: "/img/icons/glpi-logo.svg" },
];

// Une catégorie = un bloc avec son titre et une grille de mini-cartes.
// useSpotlight ici (un halo par bloc) : le hook doit être au top d'un composant,
// pas dans une boucle .map().
function SkillGroup({ title, skills }: { title: string; skills: Skill[] }) {
  const { ref, onMouseMove } = useSpotlight();
  return (
    <div ref={ref} onMouseMove={onMouseMove} className="skill-group spotlight">
      <h3>{title}</h3>
      <ul className="skill-grid">
        {skills.map((s) => (
          <li key={s.label} className="skill-card">
            {/* Rendu conditionnel via ternaire : si customIcon existe, on rend une <img>,
                sinon un <i> avec la classe Devicon ou FontAwesome.
                alt="" : le nom est écrit juste en dessous, l'image est décorative. */}
            {s.customIcon ? (
              <img src={s.customIcon} alt="" className="custom-tech-icon" />
            ) : (
              <i className={s.icon} />
            )}
            <span>{s.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Competence() {
  return (
    <section className="competences_section">
      <div className="competences_container">
        <SectionTitle>Compétences</SectionTitle>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SkillGroup title="Langages" skills={langages} />
          <SkillGroup title="Frameworks & technologies" skills={frameworks} />
          <SkillGroup title="Logiciels & outils" skills={outils} />
        </div>

        {/* Bouton téléchargement du tableau de synthèse SLAM (Excel).
            Réutilise les classes .cv-download / .btn-cv déjà stylées. */}
        <div className="cv-download">
          <a href="/excel/tableau-de-synthese.xlsx" className="btn-cv" download>
            <i className="fa-solid fa-file-excel" />
            Tableau de synthèse
          </a>
        </div>
      </div>
    </section>
  );
}
