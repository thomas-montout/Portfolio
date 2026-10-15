import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Background from "./components/Background";
import ScrollToTop from "./components/ScrollToTop";
import ScrollUI from "./components/ScrollUI";
import Home from "./pages/Home";
import Parcours from "./pages/Parcours";
import EcoleAlternance from "./pages/EcoleAlternance";
import BtsSio from "./pages/BtsSio";
import Competence from "./pages/Competence";
import MissionsE5 from "./pages/MissionsE5";
import MissionsE6 from "./pages/MissionsE6";
import VeilleTechnologique from "./pages/VeilleTechnologique";
import Contact from "./pages/Contact";
import { useRevealOnScroll } from "./hooks/useRevealOnScroll";

// Composant racine. Une route = une page :
//   /                     → Accueil (hero bento)
//   /parcours             → Présentation + parcours académique et professionnel + CV
//   /alternance           → École (Ynov) et alternance (Coface)
//   /bts                  → Le BTS SIO (SLAM / SISR)
//   /competence           → Compétences
//   /e5                   → Projets E5 (onglets formation / entreprise / personnel)
//   /e6                   → Projets E6
//   /veille-technologique → Veille technologique
//   /contact              → Contact
//   *                     → fallback vers l'accueil
export default function App() {
  // Active le fade-in au scroll sur toutes les <section> de la page courante.
  // Le hook se re-déclenche à chaque changement de route (Home → /e5…).
  useRevealOnScroll();

  return (
    <div className="relative w-full flex-1 flex flex-col">
      <ScrollToTop />
      <Header />

      {/* flex-1 : le contenu prend toute la hauteur restante, le footer reste en bas. */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/parcours" element={<Parcours />} />
          <Route path="/alternance" element={<EcoleAlternance />} />
          <Route path="/bts" element={<BtsSio />} />
          <Route path="/competence" element={<Competence />} />
          {/* Pages dédiées aux épreuves du BTS SIO. */}
          <Route path="/e5" element={<MissionsE5 />} />
          <Route path="/e6" element={<MissionsE6 />} />
          <Route path="/veille-technologique" element={<VeilleTechnologique />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <Background />
      {/* Overlay scroll : barre de progression + bouton retour en haut */}
      <ScrollUI />
    </div>
  );
}
