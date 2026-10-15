# Portfolio BTS SIO — Thomas Montout

Portfolio personnel développé dans le cadre du BTS SIO (Services Informatiques aux
Organisations), option SLAM (Solutions Logicielles et Applications Métiers), suivi
en alternance chez Ynov Campus. Le site présente le parcours, les compétences,
les missions (E5), les projets (E6) et la veille technologique attendus pour la certification.

Version 2.0 — refonte complète de l'ancien site statique HTML/CSS/JS en application
React + TypeScript, multi-page : une route React Router par rubrique.

---

## Stack technique

| Domaine     | Outil                     | Version |
| ----------- | ------------------------- | ------- |
| Build / dev | Vite                      | 6.x     |
| UI          | React                     | 18.3    |
| Langage     | TypeScript                | 5.6     |
| Routage     | React Router DOM          | 6.28    |
| Styles      | Tailwind CSS v4 + CSS BEM | 4.0     |
| Formatage   | Prettier                  | 3.7     |
| Hébergement | Vercel (déploiement auto) | -       |

---

## Structure du projet

```
portfolio/
├─ index.html              Point d'entrée HTML (Vite injecte main.tsx dedans)
├─ vite.config.ts          Plugins Vite : React + Tailwind v4, proxy /api/rss en dev
├─ tsconfig.json           Config TypeScript stricte
├─ api/
│  └─ rss.ts               Fonction serverless Vercel : relaie le flux RSS du Journal du Net
├─ public/                 Assets statiques servis tels quels (CV.pdf, favicon, etc.)
└─ src/
   ├─ main.tsx             Bootstrap React + BrowserRouter
   ├─ App.tsx              Routes : une par page (voir « Architecture »)
   ├─ index.css            Tokens @theme + CSS global
   ├─ components/          Briques réutilisables
   │  ├─ Header.tsx        Pill nav (NavLink + menu déroulant Projets → E5 / E6)
   │  ├─ Footer.tsx
   │  ├─ Background.tsx    Dots + halo curseur
   │  ├─ BentoHero.tsx     Hero en grille asymétrique (grid-template-areas)
   │  ├─ FlipCard.tsx      Carte photo recto-verso
   │  ├─ MissionCard.tsx   Carte projet compacte + grille partagée E5 / E6
   │  ├─ RssFeed.tsx       Flux RSS en direct de la page Veille
   │  ├─ Vignette.tsx      Miniature d'article (image du média, ou icône de remplacement)
   │  ├─ ScrollUI.tsx      Barre de progression lumineuse + bouton retour en haut
   │  └─ ScrollToTop.tsx   Remonte la page à chaque navigation
   ├─ pages/               Une page par route
   │  ├─ Home.tsx          Accueil : hero bento seul
   │  ├─ Parcours.tsx      Présentation + parcours, compose EcoleAlternance et BtsSio
   │  ├─ BtsSio.tsx        Section du diplôme (SLAM vs SISR), dans Parcours
   │  ├─ EcoleAlternance.tsx Section Ynov + Coface, dans Parcours
   │  ├─ Competence.tsx    Stack technique (pastilles par catégorie)
   │  ├─ MissionsE5.tsx    Projets E5 en onglets (/e5)
   │  ├─ MissionsE6.tsx    Projets E6 (/e6)
   │  ├─ VeilleTechnologique.tsx Veille + flux RSS
   │  └─ Contact.tsx       Formulaire de contact
   ├─ data/
   │  ├─ missions.ts       Source de vérité des missions (titre, slug, techs, etc.)
   │  └─ veille.ts         Fiches de veille (ordre chronologique), outils et sources
   └─ hooks/
      └─ useSpotlight.ts   Hook custom pour le halo lumineux au hover
```

---

## Architecture et choix techniques

### 1. Une page par rubrique

| Route                   | Page                                           |
| ----------------------- | ---------------------------------------------- |
| `/`                     | `Home.tsx` (hero bento)                        |
| `/parcours`             | `Parcours.tsx` (+ `EcoleAlternance`, `BtsSio`) |
| `/competence`           | `Competence.tsx`                               |
| `/e5`                   | `MissionsE5.tsx`                               |
| `/e6`                   | `MissionsE6.tsx`                               |
| `/veille-technologique` | `VeilleTechnologique.tsx`                      |
| `/contact`              | `Contact.tsx`                                  |

Le header pill liste ces pages avec des `NavLink` : React Router pose la classe
`active` sur le lien de la page courante (`end` sur `/` pour que « Accueil » ne
reste pas allumé partout). E5 et E6 sont regroupés dans un menu déroulant
« Projets » (survol à la souris, clic au tactile, toujours déplié dans le menu
burger). `ScrollToTop` remonte en haut à chaque changement de page, ou scrolle
jusqu'à l'ancre (`/parcours#bts`). Toute URL inconnue est redirigée vers `/` via
la route `path="*"`.

La barre de progression lumineuse (`ScrollUI.tsx`) balaie aussi l'écran à chaque
changement de page, pour rester visible sur les pages trop courtes pour scroller.
Le body est un « sticky footer » : sur une page courte, le footer reste en bas.

### 2. Projets E5 en onglets

`/e5` affiche une catégorie à la fois (Formation / Entreprise / Personnel).
L'onglet actif vit dans l'URL (`/e5?categorie=personnel`, via `useSearchParams`) :
le lien est partageable et le retour arrière revient sur le bon onglet. L'onglet
Formation regroupe les projets par bloc du référentiel BTS SIO. Les missions
viennent de `src/data/missions.ts` (source de vérité unique, sans duplication).

### 3. Veille : flux RSS en direct

Le bloc « Flux RSS en direct » (`RssFeed.tsx`) lit le flux « Développeur » du
Journal du Net à chaque visite, puis toutes les 10 minutes, et le parse avec
`DOMParser`. La page n'appelle pas le JDN directement, car il n'envoie pas
d'en-tête CORS et bloque les requêtes sans User-Agent de navigateur. Elle appelle
`/api/rss` :

- **en production** : fonction serverless `api/rss.ts`, qui récupère le flux côté
  serveur avec un User-Agent explicite et le met en cache 10 minutes sur le CDN Vercel ;
- **en dev** : proxy Vite déclaré dans `vite.config.ts`, sur la même URL.

Les fiches de veille vivent dans `src/data/veille.ts`, dans l'ordre chronologique.

### 4. Tailwind CSS v4 en mode hybride

Tailwind v4 est installé via `@tailwindcss/vite`, mais utilisé **principalement
comme moteur de tokens**, pas comme système d'utilitaires.

- `src/index.css` déclare les tokens dans `@theme` (couleurs, fonte) :
  ces tokens deviennent à la fois utilisables en CSS classique
  (`var(--color-bg-primary)`) et générés en classes Tailwind (`bg-bg-primary`).
- Les composants utilisent une convention BEM (`bento__cell`, `mission-detail__hero`)
  plutôt que des chaînes d'utilitaires inline.
- Quelques utilitaires Tailwind sont quand même présents pour les cas simples
  (ex. `className="relative w-full min-h-screen"` sur `<App>`).

Ce choix garde le JSX lisible et concentre le style complexe (animations, pseudo-éléments,
`grid-template-areas`) dans un seul fichier CSS facile à parcourir.

### 5. Background décoratif sans état React

Le composant `Background.tsx` superpose deux couches : une grille de dots en
`radial-gradient` répété, et un halo qui suit le curseur. Le halo est positionné
via les variables CSS `--cursor-x` / `--cursor-y` mises à jour directement sur
l'élément en JavaScript natif (pas de `useState`). C'est volontaire : éviter de
re-render React à chaque mouvement de souris.

Le hook `useSpotlight` applique le même principe pour les cartes au hover.

---

## Migration depuis l'ancien site

La v1 du portfolio était un site statique : trois fichiers (`index.html`,
`style.css`, `script.js`), pages multiples séparées (`bts-sio.html`,
`competence.html`...), navigation par rechargement complet.

La v2 conserve **l'identité visuelle** (palette bordeaux/crème, fonte Josefin Sans,
classes BEM portées tel quel) mais réécrit toute la base :

- **HTML statique multi-pages → React SPA (React Router)** : moins de duplication
  (header/footer/background définis une seule fois dans `App.tsx`).
- **Vanilla JS → composants React** : chaque section devient un composant typé
  TypeScript, réutilisable.
- **Données en dur dans le HTML → module `data/missions.ts`** : les missions sont
  définies une fois, consommées par les pages `MissionsE5` **et** `MissionsE6`.
  Ajouter une mission = ajouter une entrée dans le tableau.
- **CSS recompilé manuellement → Vite + Tailwind v4** : hot-reload en dev,
  bundling et minification automatiques en build.
- **Navigation par liens classiques → React Router** : changement de page sans rechargement.

Le CSS de la v1 a été conservé dans `index.css` en BEM, avec quelques sections
réorganisées (commentaires `========== SECTION ==========` pour repérer chaque
zone).

---

## Contexte BTS SIO

Le BTS SIO (Services Informatiques aux Organisations) est un diplôme de niveau 5
(bac+2) de l'enseignement supérieur français. Il se divise en deux options :

- **SLAM** (Solutions Logicielles et Applications Métiers) — développement
  d'applications, c'est l'option suivie ici.
- **SISR** (Solutions d'Infrastructure, Systèmes et Réseaux) — administration
  réseau et systèmes.

---

## Démarrer le projet en local

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement (Vite, hot-reload)
npm run dev

# Construire la version de production (sortie dans dist/)
npm run build

# Prévisualiser le build de production en local
npm run preview

# Formater tous les fichiers avec Prettier
npm run format
```

Le serveur de dev tourne par défaut sur `http://localhost:5173`.

---

## Déploiement sur Vercel

Le site est déployé sur Vercel avec **auto-détection** : Vercel reconnaît
automatiquement un projet Vite et applique la configuration suivante sans
fichier `vercel.json` :

- **Build command** : `npm run build` (déclenche `tsc -b && vite build`)
- **Output directory** : `dist/`
- **Install command** : `npm install`
- **Node version** : détectée depuis l'environnement (LTS récente)

### Workflow de déploiement

1. Push sur `main` → Vercel construit et déploie en production automatiquement.
2. Push sur une autre branche → Vercel crée une **preview deployment** (URL
   dédiée par PR/branche) pour tester avant de merger.

### Point d'attention : React Router et le rewrite SPA

Cette application utilise des routes côté client (`/e5`, `/e6`...). Sans
configuration de rewrite, un visiteur qui rafraîchit la page sur
`https://ton-site.vercel.app/e5` reçoit un 404 — Vercel cherche un
fichier `e5.html` qui n'existe pas.

Vercel applique heureusement un rewrite par défaut pour les projets Vite,
mais si jamais le problème apparaît, ajouter à la racine un fichier
`vercel.json` :

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Cette règle envoie toutes les URLs vers `index.html`, qui charge React Router,
qui résout ensuite la route côté client.

---

## Conventions

- **TypeScript strict** : pas de `any`, props typées sur chaque composant.
- **Nommage CSS** : BEM (`bloc__element--modifier`).
- **Commentaires** : chaque composant et chaque section CSS comporte un en-tête
  expliquant l'intention et les notions employées (utile en révision pour le BTS).
- **Prettier** : `npm run format` avant chaque commit.
