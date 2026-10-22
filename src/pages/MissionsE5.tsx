import { useSearchParams } from "react-router-dom";
import {
  type MissionBlock,
  type MissionCategory,
  missionsByBlock,
  missionsByCategory,
} from "../data/missions";
import { MissionGrid } from "../components/MissionCard";
import SectionTitle from "../components/SectionTitle";

// Page dédiée E5 (route /e5).
// Les données vivent dans /data/missions.ts → une seule source de vérité partagée
// avec la page E6 (/e6).
//
// Onglets Formation / Entreprise / Personnel : une seule catégorie affichée à la fois,
// au lieu de 3 sections empilées → beaucoup moins de scroll.
// L'onglet actif est stocké dans l'URL (?categorie=personnel) plutôt que dans un useState :
// le lien est partageable, et après avoir ouvert un PDF, le retour arrière revient
// sur le bon onglet.

const tabs: { key: MissionCategory; label: string }[] = [
  { key: "formation", label: "Formation" },
  { key: "entreprise", label: "Entreprise" },
  { key: "personnel", label: "Personnel" },
];

// Blocs BTS SIO affichés dans l'onglet formation : SLAM (l'option du BTS) en premier,
// support en dernier.
const formationBlocks: { key: MissionBlock; title: string }[] = [
  { key: "slam", title: "Solution Logiciel et Application Métier" },
  { key: "cyber", title: "Cybersécurité des services informatiques" },
  { key: "support", title: "Support et mise à disposition de services informatiques" },
];

export default function MissionsE5() {
  const [searchParams, setSearchParams] = useSearchParams();
  // Valeur absente ou inconnue dans l'URL → onglet formation par défaut.
  const current = tabs.find((t) => t.key === searchParams.get("categorie"))?.key ?? "formation";

  return (
    <section className="missions_E5_section">
      <div className="missions_E5_container">
        <SectionTitle>Projets E5</SectionTitle>
        <p>
          Projets réalisés dans le cadre de ma formation en BTS SIO, mettant en avant mes
          compétences techniques et ma capacité à travailler sur des projets variés.
        </p>

        {/* Barre d'outils : onglets à gauche, tableau de synthèse à droite. */}
        <div className="missions-toolbar">
          <div className="tabs" role="tablist">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={current === t.key}
                className={`tab ${current === t.key ? "active" : ""}`}
                // replace : changer d'onglet ne crée pas une entrée d'historique par clic.
                onClick={() => setSearchParams({ categorie: t.key }, { replace: true })}
              >
                {t.label}
                <span className="tab__count">{missionsByCategory(t.key).length}</span>
              </button>
            ))}
          </div>
          {/* download : le navigateur télécharge le fichier au lieu d'essayer de l'ouvrir. */}
          <a href="/excel/tableau-de-synthese.xlsx" className="btn-synthese" download>
            <i className="fa-solid fa-file-excel" />
            Tableau de synthèse
          </a>
        </div>

        {current === "formation" ? (
          // Onglet formation : regroupé par bloc du référentiel BTS SIO.
          formationBlocks.map((b) => {
            const list = missionsByBlock(b.key);
            return (
              <div key={b.key}>
                <h3 className="subsection_title">
                  <span>{b.title}</span>
                </h3>
                {list.length > 0 ? (
                  <MissionGrid list={list} />
                ) : (
                  // Placeholder "À venir" : montre la structure complète des 3 blocs même si l'un est vide.
                  <p className="empty-block-message">À venir</p>
                )}
              </div>
            );
          })
        ) : (
          <MissionGrid list={missionsByCategory(current)} />
        )}
      </div>
    </section>
  );
}
