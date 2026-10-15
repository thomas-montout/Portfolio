import { useState } from "react";

// Vignette d'article : l'image fournie par le média si elle existe et se charge, sinon un
// visuel de remplacement (icône sur le dégradé du thème). Partagée par les fiches de veille
// et le flux RSS en direct.
// - alt="" : image décorative, le titre à côté dit déjà de quoi parle l'article.
// - loading="lazy" : le navigateur ne la télécharge qu'à l'approche de l'écran.
// - referrerPolicy="no-referrer" : n'envoie pas l'adresse de mon site au média ; certains
//   serveurs d'images refusent les requêtes qui viennent d'un autre site.
export default function Vignette({
  src,
  icon,
  className = "",
}: {
  src?: string;
  icon: string; // classe Font Awesome du visuel de remplacement
  className?: string;
}) {
  // Passe à true si l'image ne se charge pas (lien cassé, site du média en panne…).
  const [erreur, setErreur] = useState(false);

  if (src && !erreur) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setErreur(true)}
        className={`vignette ${className}`}
      />
    );
  }
  return (
    <span className={`vignette vignette--placeholder ${className}`} aria-hidden="true">
      <i className={icon} />
    </span>
  );
}
