import { missionsE6 } from "../data/missions";
import { MissionGrid } from "../components/MissionCard";
import SectionTitle from "../components/SectionTitle";

// Page dédiée E6 (route /e6).
// Les projets E6 (epreuve: "E6" dans data/missions.ts) n'apparaissent que sur cette page.
// Ils partagent le même contexte, PlayZone, présenté une seule fois au-dessus des cartes.
export default function MissionsE6() {
  return (
    <section className="missions_E5_section">
      <div className="missions_E5_container">
        <SectionTitle>Projets E6</SectionTitle>
        <p>Projets présentés dans le cadre de l'épreuve E6 du BTS SIO.</p>

        <h3 className="subsection_title">
          <span>PlayZone</span>
        </h3>
        <p className="subsection-intro">
          L'entreprise ATM (contexte fictif) développe pour la Mairie de Paris une plateforme de
          réservation de lieux de loisirs : un site web pour les visiteurs (client léger) et une
          application de bureau pour les gérants et les agents de la Ville (client lourd), reliés à
          la même base de données.
        </p>
        <MissionGrid list={missionsE6} />
      </div>
    </section>
  );
}
