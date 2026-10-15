import { useSpotlight } from "../hooks/useSpotlight";
import type { Mission } from "../data/missions";

// Icône Font Awesome affichée devant chaque bouton, selon son libellé.
const linkIcons: Record<string, string> = {
  Documentation: "fa-solid fa-file-lines",
  Github: "fa-brands fa-github",
  Live: "fa-solid fa-arrow-up-right-from-square",
};

// Carte d'une mission, partagée entre les pages Projets E5 et Projets E6.
// Version compacte : techs en icônes seules (nom au survol via title, et lu par les
// lecteurs d'écran via sr-only), boutons en petites pastilles sur une ligne.
// useSpotlight DANS ce composant (pas dans un .map() parent) → chaque carte a son
// propre ref + handler, sinon ça casserait les Rules of Hooks.
export default function MissionCard({ mission }: { mission: Mission }) {
  const { ref, onMouseMove } = useSpotlight();
  return (
    <div ref={ref} onMouseMove={onMouseMove} className="card-E5 spotlight">
      <img className="card-E5-img" src={mission.image} alt={mission.title} />
      <div className="card-E5-body">
        <h5 className="card-E5-title">{mission.title}</h5>
        <p className="card-E5-text">{mission.description}</p>
        <div className="card-E5-icons">
          {mission.techs.map((t) => (
            <div key={t.label} className="tech-icon" title={t.label}>
              {t.customIcon ? (
                <img src={t.customIcon} alt="" className="custom-tech-icon" />
              ) : (
                <i className={t.icon} />
              )}
              <span className="sr-only">{t.label}</span>
            </div>
          ))}
        </div>
        {/* Boutons : uniquement les liens fournis par la donnée (Documentation PDF, Github…).*/}
        {mission.links.length > 0 && (
          <div className="card-actions">
            {mission.links.map((a) => (
              <a key={a.label} href={a.href} className="btn-mission">
                {linkIcons[a.label] && <i className={linkIcons[a.label]} />}
                {a.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Grille de cartes responsive, partagée par les pages E5 et E6 :
// 1 colonne en mobile → 2 (sm) → 3 (lg) → 4 en grand écran (xl).
export function MissionGrid({ list }: { list: Mission[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
      {list.map((m) => (
        <MissionCard key={m.slug} mission={m} />
      ))}
    </div>
  );
}
