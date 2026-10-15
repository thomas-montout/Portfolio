import SectionTitle from "../components/SectionTitle";

// Page Parcours (route /parcours) : présentation, parcours académique et professionnel
// côte à côte, puis le CV.
// L'école/alternance et le BTS ont chacun leur page (/alternance, /bts), accessibles
// depuis le menu déroulant « Parcours » du header et depuis les cartes de l'accueil.
export default function Parcours() {
  return (
    <section className="about_me_section">
      <div className="about_me_container">
        <SectionTitle>Parcours</SectionTitle>
        <p className="parcours-intro">
          Tout a commencé par une <strong>curiosité</strong>.
          <br />
          Puis un premier tutoriel. Puis des heures à <strong>comprendre</strong>,{" "}
          <strong>tester, casser… et recommencer</strong>.
          <br />
          C'est comme ça que le <strong>développement informatique</strong> est devenu une vraie{" "}
          <strong>passion</strong>. En <strong>autodidacte</strong>, j'ai découvert ce que j'aimais
          vraiment : résoudre des problèmes, structurer des idées et leur donner vie grâce au code.
          <br />
          Aujourd'hui, je poursuis ce chemin en BTS SIO SLAM en alternance, avec une envie claire :
          monter en compétences, gagner de l'expérience terrain et construire des bases solides.
          <br />
          Objectif : devenir <strong>Software Engineer</strong>.
        </p>

        {/* Les deux parcours côte à côte en grand écran (empilés en dessous de lg). */}
        <div className="parcours-timelines grid grid-cols-1 lg:grid-cols-2 gap-x-6">
          <div>
            <h3 className="subsection_title">Parcours académique</h3>
            <div className="education-timeline">
              <div className="education-item">
                <span className="year">2025</span>
                <div className="education-details">
                  <strong>BTS Services Informatiques aux Organisations</strong>
                  <span className="school">Ynov Campus</span>
                </div>
              </div>
              <div className="education-item">
                <span className="year">2017</span>
                <div className="education-details">
                  <strong>Baccalauréat STMG option mercatique</strong>
                  <span className="school">Lycée de l'Union</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="subsection_title">Parcours professionnel</h3>
            <div className="education-timeline">
              <div className="education-item">
                <span className="year">2025 - en cours</span>
                <div className="education-details">
                  <strong>Application support niv.2</strong>
                  <span className="school">Coface</span>
                  <span className="job-location">Bois-Colombes • Alternance</span>
                  <ul className="job-tasks">
                    <li>Gestion des identités et des accès aux applications métiers</li>
                    <li>Support technique de niveau 2 pour les utilisateurs finaux</li>
                    <li>Participation à des projets d'amélioration continue du workflow IAM</li>
                  </ul>
                </div>
              </div>
              <div className="education-item">
                <span className="year">2019 - 2025</span>
                <div className="education-details">
                  <strong>Assistant d'éducation</strong>
                  <span className="school">
                    Collège J-P Rameau, EIB de la Jonchère, Lycée Hoche, Lycée Jules Ferry
                  </span>
                  <span className="job-location">Versailles, La Celle-Saint-Cloud • CDD</span>
                  <ul className="job-tasks">
                    <li>Assistance aux personnels pour la résolution de problèmes informatiques</li>
                    <li>
                      Collaboration avec les équipes pour améliorer les outils numériques existants
                    </li>
                    <li>
                      Gestion administrative : suivi des absences et retards, saisie des données sur
                      les logiciels de gestion scolaire
                    </li>
                    <li>
                      Médiation et discipline : gestion des conflits entre élèves, application du
                      règlement intérieur
                    </li>
                    <li>
                      Organisation d'événements : participation à la mise en place de projets
                      éducatifs et culturels
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="cv-download">
          <a href="/pdf/CV-Montout Thomas.pdf" className="btn-cv" download>
            <i className="fa-solid fa-download" />
            Télécharger mon CV
          </a>
        </div>
      </div>
    </section>
  );
}
