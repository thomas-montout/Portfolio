import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

type PageLink = { to: string; label: string };
// Un item de nav est soit un lien vers une page, soit un groupe de liens (menu déroulant).
type NavItem = PageLink | { label: string; children: PageLink[] };

// Liste centralisée des items de nav : ajouter une entrée = ajouter ici, pas dans le JSX.
// Chaque lien = une page (route déclarée dans App.tsx).
const navItems: NavItem[] = [
  { to: "/", label: "Accueil" },
  {
    label: "Parcours",
    children: [
      { to: "/parcours", label: "Mon parcours" },
      { to: "/alternance", label: "École & alternance" },
      { to: "/bts", label: "BTS SIO" },
      { to: "/identite-numerique", label: "Identité numérique" },
    ],
  },
  { to: "/competence", label: "Compétences" },
  { to: "/e5", label: "Projets E5" },
  { to: "/e6", label: "Projets E6" },
  { to: "/veille-technologique", label: "Veille" },
  { to: "/contact", label: "Contact" },
];

// Menu déroulant d'un groupe de liens (ex : Parcours → Mon parcours / BTS SIO…).
// - Souris : s'ouvre au survol. Tactile / clavier : s'ouvre au clic sur le bouton.
// - Se referme au clic en dehors, sur Échap, ou quand on choisit une page.
// - En mobile (menu burger), le CSS l'affiche toujours déplié : le bouton devient un simple intitulé.
function NavDropdown({
  label,
  items,
  onNavigate,
}: {
  label: string;
  items: PageLink[];
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  // Le bouton du groupe s'allume quand on est sur une de ses pages.
  const isActive = items.some((i) => pathname.startsWith(i.to));

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      // contains = le clic a-t-il eu lieu DANS le menu ? Si non, on ferme.
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="pill-dropdown"
      // pointerType === "mouse" : sur écran tactile, un tap déclenche aussi pointerenter,
      // qui ouvrirait le menu juste avant que le clic ne le referme.
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
    >
      <button
        type="button"
        className={`pill-dropdown__toggle ${isActive ? "active" : ""}`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {label} <i className="fa-solid fa-chevron-down" />
      </button>
      <div className={`pill-dropdown__menu ${open ? "open" : ""}`}>
        {items.map((i) => (
          <NavLink
            key={i.to}
            to={i.to}
            onClick={() => {
              setOpen(false);
              onNavigate();
            }}
          >
            {i.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

// Header flottant
// - Centré en haut, fond semi-transparent + backdrop-blur (effet de flou sur le fond)
// - Un NavLink par page : React Router pose tout seul la classe "active" sur le lien
//   de la page courante, pas besoin de gérer un state "active" à la main.
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="pill-header">
      {/* Burger mobile : caché sur desktop via CSS */}
      <button className="pill-burger" aria-label="Menu" onClick={() => setMobileOpen((v) => !v)}>
        <i className={`fa-solid ${mobileOpen ? "fa-times" : "fa-bars"}`} />
      </button>

      <nav className={`pill-nav ${mobileOpen ? "open" : ""}`}>
        {/* map = méthode pour faire une boucle dans le JSX, cela va créer un lien pour chaque item de la liste navItems. */}
        {navItems.map((item) =>
          // "children" in item = narrowing TypeScript : dans cette branche, TS sait que c'est un groupe.
          "children" in item ? (
            <NavDropdown
              key={item.label}
              label={item.label}
              items={item.children}
              onNavigate={closeMobile}
            />
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              // end sur "/" : sans lui, "Accueil" serait actif partout (toutes les URLs commencent par "/").
              end={item.to === "/"}
              // On referme le menu mobile une fois la page choisie.
              onClick={closeMobile}
            >
              {item.label}
            </NavLink>
          )
        )}
      </nav>
    </header>
  );
}
