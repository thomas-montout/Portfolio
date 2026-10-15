import { missions } from "../data/missions";
import { MissionGrid } from "../components/MissionCard";
import SectionTitle from "../components/SectionTitle";

// Page dédiée E6 (route /e6).
// Projets E6 = filtrage direct sur le tableau missions (l'épreuve est portée par chaque mission).
// Une mission taggée E6 garde sa catégorie : elle apparaît donc aussi sur la page E5.
// Pas de limite ici : la page ne sert qu'à ça, on affiche tout.
export default function MissionsE6() {
  const projetsE6 = missions.filter((m) => m.epreuve === "E6");

  return (
    <section className="missions_E5_section">
      <div className="missions_E5_container">
        <SectionTitle>Projets E6</SectionTitle>
        <p>Projets présentés dans le cadre de l'épreuve E6 du BTS SIO.</p>

        <MissionGrid list={projetsE6} />
      </div>
    </section>
  );
}
