import BentoHero from "../components/BentoHero";

// Page d'accueil : le hero bento seul, qui tient sur un écran.
// Chaque cellule du hero mène vers la page correspondante (Parcours, Compétences, Projets).
// Les autres rubriques ont chacune leur propre page, déclarée dans App.tsx.
export default function Home() {
  return <BentoHero />;
}
