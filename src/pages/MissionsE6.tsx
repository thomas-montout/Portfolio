import { missionsE6 } from "../data/missions";
import MissionCard from "../components/MissionCard";
import SectionTitle from "../components/SectionTitle";

// Page dédiée E6 (route /e6).
// Les projets E6 (epreuve: "E6" dans data/missions.ts) n'apparaissent que sur cette page.
// Ils partagent le même contexte, PlayZone : on le présente une fois (fiche + schéma
// « 2 applications, 1 base »), puis les deux projets côte à côte, en grand.

// Fiche du contexte, rendue en liste de définitions (<dl> : un terme <dt>, sa valeur <dd>).
const fiche: { label: string; valeur: string }[] = [
  { label: "Client", valeur: "Mairie de Paris (contexte fictif)" },
  { label: "Prestataire", valeur: "ATM, entreprise de services numériques (fictive)" },
  { label: "Équipe", valeur: "3 développeurs" },
  { label: "Période", valeur: "2026 – 2027, en cours" },
];

export default function MissionsE6() {
  return (
    <section className="missions_E5_section">
      <div className="missions_E5_container">
        <SectionTitle>Projets E6</SectionTitle>
        <p>Projets présentés dans le cadre de l'épreuve E6 du BTS SIO.</p>

        <div className="e6-contexte">
          <div>
            <span className="e6-contexte__label">Contexte commun · PlayZone</span>
            <p className="e6-contexte__texte">
              Une plateforme pour réserver une activité de loisirs à Paris : karting, laser game,
              escape game ou bowling, dans des lieux partenaires.
            </p>
            <dl className="e6-fiche">
              {fiche.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.valeur}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Schéma d'architecture : les deux applications ne se parlent jamais directement,
              la base de données est leur seul point commun. */}
          <div className="e6-archi">
            <div className="e6-archi__bloc">
              <i className="fa-solid fa-globe" aria-hidden="true" />
              <strong>Client léger</strong>
              <span>Site web · visiteurs</span>
            </div>
            <i className="fa-solid fa-arrow-right e6-archi__fleche" aria-hidden="true" />
            <div className="e6-archi__bloc e6-archi__bloc--bdd">
              <i className="fa-solid fa-database" aria-hidden="true" />
              <strong>Base MySQL</strong>
              <span>commune aux deux</span>
            </div>
            <i className="fa-solid fa-arrow-left e6-archi__fleche" aria-hidden="true" />
            <div className="e6-archi__bloc">
              <i className="fa-solid fa-desktop" aria-hidden="true" />
              <strong>Client lourd</strong>
              <span>Application Java · gérants, agents</span>
            </div>
          </div>
        </div>

        {/* Deux projets seulement : 2 colonnes au lieu de la grille de 4 des autres pages. */}
        <div className="e6-projets grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {missionsE6.map((m) => (
            <MissionCard key={m.slug} mission={m} />
          ))}
        </div>
      </div>
    </section>
  );
}
