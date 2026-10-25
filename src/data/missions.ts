// Source unique des missions affichées sur le portfolio.
// Importé par les pages dédiées /e5 (MissionsE5) et /e6 (MissionsE6).
//
// NOTION : "Single source of truth" — une donnée n'est définie qu'à UN seul endroit.
// Tout changement se répercute partout.
//
// ORDRE DU TABLEAU `missions` ci-dessous :
// Le tableau est rangé pour refléter l'ordre d'affichage du site.
// 1) FORMATION → sous-groupes par bloc BTS SIO : Support, Cyber, SLAM
// 2) ENTREPRISE
// 3) PERSONNEL
// 4) E6 → projets taggés `epreuve: "E6"` (PlayZone), affichés uniquement sur /e6.
//
// CONVENTION DE TITRE : uniquement le nom du projet, sans préfixe de type
// (« Atelier — », « Labo — »…). Tout est un projet : la catégorie et le bloc
// suffisent à les classer.
//
// Cet ordre et ces conventions n'ont PAS d'incidence fonctionnelle (les
// pages re-filtrent via missionsByCategory / missionsByBlock) — c'est de
// la lisibilité pure pour faciliter la maintenance.

export type TechIcon = {
  label: string;
  icon?: string; // classe Devicon ou Font Awesome, ex: "devicon-react-plain colored"
  customIcon?: string; // ou chemin d'image custom
};

export type MissionCategory = "formation" | "entreprise" | "personnel"; // "|" = union type, permet de restreindre les valeurs possibles.

// Blocs BTS SIO (référentiel pédagogique). Utilisés uniquement pour les missions
// de catégorie "formation", dans l'onglet Formation de la page /e5.
// "support" = Support et mise à disposition de services informatiques.
// "cyber"   = Cybersécurité des services informatiques.
// "slam"    = Solution logiciel et application métier (l'option du BTS).
export type MissionBlock = "support" | "cyber" | "slam";

export type Mission = {
  slug: string; // identifiant URL-friendly
  title: string;
  description: string; // résumé affiché sur la carte
  image: string;
  techs: TechIcon[];
  links: { label: string; href: string }[];
  category: MissionCategory;
  epreuve?: "E6"; // projet de l'épreuve E6 : affiché sur /e6 et retiré de /e5.
  block?: MissionBlock; // pour les missions "formation" : bloc BTS SIO de rattachement.
};

export const missions: Mission[] = [
  // ════════════════════════════════════════════════════════════════════
  // FORMATION
  // ════════════════════════════════════════════════════════════════════

  // ─── Support et mise à disposition de services informatiques ───
  {
    slug: "serveur-apache",
    title: "Serveur web Apache",
    description:
      "Installer Apache2 sur Ubuntu, le tester depuis le navigateur, puis analyser son arborescence et sa configuration modulaire.",
    image: "/img/photos/minia-apache.jpg",
    techs: [
      { label: "Ubuntu", icon: "devicon-ubuntu-plain colored" },
      { label: "Apache", icon: "devicon-apache-plain colored" },
    ],
    links: [{ label: "Documentation", href: "/pdf/doc-apache.pdf" }],
    category: "formation",
    block: "support",
  },
  {
    slug: "gestion-parc-informatique",
    title: "GLPI × OCS Inventory",
    description:
      "Déployer GLPI et OCS Inventory sur un serveur Ubuntu, inventorier le parc par agents, puis traiter des tickets reliés aux machines.",
    image: "/img/photos/minia-ocs-glpi.png",
    techs: [
      { label: "Ubuntu", icon: "devicon-ubuntu-plain colored" },
      { label: "Apache", icon: "devicon-apache-plain colored" },
      { label: "MariaDB", icon: "devicon-mysql-plain colored" },
      { label: "PHP", icon: "devicon-php-plain colored" },
      { label: "OCS Inventory", customIcon: "/img/icons/ocs-logo.png" },
      { label: "GLPI", customIcon: "/img/icons/glpi-logo.svg" },
    ],
    links: [{ label: "Documentation", href: "/pdf/doc-OCS-GLPI.pdf" }],
    category: "formation",
    block: "support",
  },
  // {
  //   slug: "windows-server-2019",
  //   title: "Windows Server 2019",
  //   description: "Installer Windows Server 2019 en VM et le configurer.",
  //   image: "/img/photos/minia-winserver.jpg",
  //   techs: [
  //     { label: "Windows Server", icon: "devicon-windows8-plain colored" },
  //     { label: "VMware", customIcon: "/img/icons/vmware-logo.svg" },
  //   ],
  //   links: [{ label: "Documentation", href: "/pdf/doc-windowsserver.pdf" }],
  //   category: "formation",
  //   block: "support",
  // },

  // ─── Cybersécurité des services informatiques ───
  // Ordre pédagogique : prépa DVWA → attaque DVWA, puis crypto.
  // {
  //   slug: "verif-integrite",
  //   title: "Vérification d'intégrité",
  //   description: "Vérifier qu'un téléchargement n'a pas été altéré via SHA-256.",
  //   image: "/img/photos/kali-linux1.png",
  //   techs: [
  //     { label: "Kali Linux", customIcon: "/img/icons/logo-kali.png" },
  //     { label: "Powershell", icon: "devicon-powershell-plain colored" },
  //   ],
  //   links: [{ label: "Documentation", href: "/pdf/doc-verif-integrite.pdf" }],
  //   category: "formation",
  //   block: "cyber",
  // },
  // {
  //   slug: "besoin-chiffrement",
  //   title: "Besoin de chiffrement",
  //   description: "Démontrer pourquoi et comment chiffrer les communications.",
  //   image: "/img/photos/kali-linux1.png",
  //   techs: [
  //     { label: "Linux", icon: "devicon-linux-plain colored" },
  //     { label: "VMware", customIcon: "/img/icons/vmware-logo.svg" },
  //   ],
  //   links: [{ label: "Documentation", href: "/pdf/doc-besoin-chiffrement.pdf" }],
  //   category: "formation",
  //   block: "cyber",
  // },
  {
    slug: "dvwa-deployment",
    title: "Lab de cybersécurité DVWA",
    description:
      "Déployer DVWA sur Kali Linux et le confiner en local dans une VM isolée, pour s'entraîner légalement aux tests de sécurité.",
    image: "/img/photos/dvwa.png",
    techs: [
      { label: "Kali Linux", customIcon: "/img/icons/logo-kali.png" },
      { label: "Apache", icon: "devicon-apache-plain colored" },
      { label: "MariaDB", icon: "devicon-mysql-plain colored" },
      { label: "PHP", icon: "devicon-php-plain colored" },
    ],
    links: [{ label: "Documentation", href: "/pdf/doc-d%C3%A9ploiement-DVWA.pdf" }],
    category: "formation",
    block: "cyber",
  },
  {
    slug: "dvwa-bruteforce",
    title: "Attaque par force brute",
    description:
      "Exploiter une faille d'authentification de DVWA avec Burp Suite Intruder, puis en déduire les mesures pour la corriger.",
    image: "/img/photos/dvwa.png",
    techs: [
      { label: "Kali Linux", customIcon: "/img/icons/logo-kali.png" },
      { label: "Burp Suite", icon: "devicon-burpsuite-plain colored" },
    ],
    links: [{ label: "Documentation", href: "/pdf/doc-bruteforce.pdf" }],
    category: "formation",
    block: "cyber",
  },
  // {
  //   slug: "crypto-asymetrique",
  //   title: "Cryptographie asymétrique",
  //   description:
  //     "Générer une paire de clés, chiffrer un message, puis signer et vérifier.",
  //   image: "/img/photos/kali-linux1.png",
  //   techs: [
  //     { label: "Linux", icon: "devicon-linux-plain colored" },
  //     { label: "openSSL", customIcon: "/img/icons/logo-openssl.png" },
  //   ],
  //   links: [{ label: "Documentation", href: "/pdf/doc-assymetriccryptography.pdf" }],
  //   category: "formation",
  //   block: "cyber",
  // },

  // ─── Solution Logiciel et Application Métier (SLAM) ───
  {
    slug: "e-enseignement",
    title: "E-enseignement",
    description:
      "Site pédagogique et vitrine du groupe, réalisé en équipe de quatre : cours et exercices corrigés en algo, C, Java, JavaScript et PHP.",
    image: "/img/photos/minia-e-enseignement.png",
    techs: [
      { label: "HTML", icon: "devicon-html5-plain colored" },
      { label: "CSS", icon: "devicon-css3-plain colored" },
      { label: "JavaScript", icon: "devicon-javascript-plain colored" },
      { label: "Docker", icon: "devicon-docker-plain colored" },
      { label: "nginx", icon: "devicon-nginx-original colored" },
    ],
    links: [
      { label: "Live", href: "https://thomas-montout.github.io/E-enseignement/" },
      { label: "Github", href: "https://github.com/thomas-montout/E-enseignement" },
      { label: "Documentation", href: "/pdf/doc-e-enseignement.pdf" },
    ],
    category: "formation",
    block: "slam",
  },
  // {
  //   slug: "symfony-biblios",
  //   title: "Symfony Biblios",
  //   description:
  //     "Démarrer un projet Symfony 7 de zéro pour comprendre le cycle d'une requête HTTP, le routing et le rendu via Twig.",
  //   image: "/img/photos/minia-symfony.jpg",
  //   techs: [{ label: "Symfony", icon: "devicon-symfony-plain colored" }],
  //   links: [{ label: "Documentation", href: "/pdf/doc-symfony.pdf" }],
  //   category: "formation",
  //   block: "slam",
  // },
  // {
  //   slug: "atelier-symfony-twig",
  //   title: "Symfony & Twig",
  //   description: "Construire des vues dynamiques avec Twig dans Symfony.",
  //   image: "/img/photos/twig.png",
  //   techs: [
  //     { label: "PHP", icon: "devicon-php-plain colored" },
  //     { label: "Symfony", icon: "devicon-symfony-plain colored" },
  //     { label: "Twig", customIcon: "/img/icons/logo-twig.png" },
  //   ],
  //   links: [],
  //   category: "formation",
  //   block: "slam",
  // },
  // {
  //   slug: "atelier-mvc",
  //   title: "Pattern MVC",
  //   description: "Comprendre le pattern MVC et ce qu'il apporte pour un projet web.",
  //   image: "/img/photos/minia-mvc.png",
  //   techs: [{ label: "PHP", icon: "devicon-php-plain colored" }],
  //   links: [{ label: "Documentation", href: "/pdf/doc-atelierMVC.pdf" }],
  //   category: "formation",
  //   block: "slam",
  // },
  // {
  //   slug: "tp-mysql",
  //   title: "MySQL / MariaDB",
  //   description: "Tavail pratique pour s'approprier SQL autour d'un mini-blog.",
  //   image: "/img/photos/minia-mysql.png",
  //   techs: [
  //     { label: "MySQL", icon: "devicon-mysql-plain colored" },
  //     { label: "Linux", icon: "devicon-linux-plain colored" },
  //   ],
  //   links: [{ label: "Documentation", href: "/pdf/doc-initiation-pratique-mysql-mariadb.pdf" }],
  //   category: "formation",
  //   block: "slam",
  // },
  // {
  //   slug: "tp-php",
  //   title: "PHP fondamentaux",
  //   description: "Six exercices progressifs pour ancrer les bases du PHP côté serveur.",
  //   image: "/img/photos/minia-php.jpeg",
  //   techs: [
  //     { label: "MySQL", icon: "devicon-mysql-plain colored" },
  //     { label: "PHP", icon: "devicon-php-plain colored" },
  //   ],
  //   links: [{ label: "Documentation", href: "/pdf/doc-travaux-pratique-fondamentauxPHP.pdf" }],
  //   category: "formation",
  //   block: "slam",
  // },

  // ════════════════════════════════════════════════════════════════════
  // ENTREPRISE
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "request-tool",
    title: "Request Tool",
    description:
      "Remplacer le template Excel de demandes d'accès IAM par un outil dédié : étude, conception du workflow, tests UAT et déploiement en production.",
    image: "/img/photos/minia-request-tool.png",
    techs: [
      { label: "Request Tool", customIcon: "/img/icons/logo-request-tool.svg" },
      { label: "Excel", icon: "fa-solid fa-file-excel" },
    ],
    links: [],
    category: "entreprise",
  },
  {
    slug: "broker-portal",
    title: "Comptes Broker Portal",
    description:
      "Accélérer la création des comptes Broker Portal en adaptant les requêtes SQL qui récupèrent les données de référence.",
    image: "/img/photos/minia-broker-portal.png",
    techs: [
      { label: "SQL Developer", icon: "devicon-sqldeveloper-plain colored" },
      { label: "FileZilla", icon: "devicon-filezilla-plain colored" },
    ],
    links: [],
    category: "entreprise",
  },
  {
    slug: "habilitations-iam",
    title: "Habilitations IAM",
    description:
      "Contrôler et attribuer les droits d'accès (arrivées, mutations, départs) selon les règles IAM, les approbations et les niveaux de délégation.",
    image: "/img/photos/minia-habilitations-iam.png",
    techs: [
      { label: "Excel", icon: "fa-solid fa-file-excel" },
      { label: "Confluence", icon: "devicon-confluence-plain colored" },
    ],
    links: [],
    category: "entreprise",
  },
  {
    slug: "template-iam",
    title: "Template IAM",
    description:
      "Faire évoluer le template Excel de demandes d'accès : nouveaux formulaires, formules, validations de données et listes déroulantes.",
    image: "/img/photos/minia-template-iam.png",
    techs: [{ label: "Excel", icon: "fa-solid fa-file-excel" }],
    links: [],
    category: "entreprise",
  },
  {
    slug: "transfert-iam",
    title: "Transfert d'activité IAM",
    description:
      "Assurer la continuité de service pendant le transfert de l'activité IAM vers un prestataire : procédures, guides et accompagnement.",
    image: "/img/photos/minia-transfert-iam.png",
    techs: [{ label: "Confluence", icon: "devicon-confluence-plain colored" }],
    links: [],
    category: "entreprise",
  },
  {
    slug: "bot-iam",
    title: "Bot IAM",
    description:
      "Bot d'assistance basé sur la RAG (Retrieval Augmented Generation) pour répondre aux questions IAM des équipes en s'appuyant sur la doc interne.",
    image: "/img/photos/minia-botiam.png",
    techs: [
      { label: "Next.js", icon: "devicon-nextjs-plain colored" },
      { label: "Python", icon: "devicon-python-plain colored" },
      { label: "FastAPI", icon: "devicon-fastapi-plain colored" },
      { label: "Pandas", icon: "devicon-pandas-plain colored" },
      { label: "Numpy", icon: "devicon-numpy-plain colored" },
    ],
    links: [{ label: "Github", href: "https://github.com/thomas-montout/bot-iam" }],
    category: "entreprise",
  },

  // ════════════════════════════════════════════════════════════════════
  // PERSONNEL
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "portfolio",
    title: "Portfolio",
    description: "Portfolio développé pour porter ma soutenance E5.",
    image: "/img/photos/minia-portfolio.png",
    techs: [
      { label: "React", icon: "devicon-react-plain colored" },
      { label: "TypeScript", icon: "devicon-typescript-plain colored" },
      { label: "Vite", icon: "devicon-vite-plain colored" },
      { label: "Tailwind", icon: "devicon-tailwindcss-plain colored" },
    ],
    links: [
      { label: "Github", href: "https://github.com/thomas-montout/portfolio" },
      { label: "Live", href: "https://thomas-montout.vercel.app/" },
    ],
    category: "personnel",
  },
  {
    slug: "in-the-cave",
    title: "In the Cave",
    description:
      "Transformer un exercice JavaScript freeCodeCamp en RPG de combat jouable dans le navigateur, avec React et TypeScript.",
    image: "/img/photos/minia-inthecave.jpg",
    techs: [
      { label: "React", icon: "devicon-react-plain colored" },
      { label: "TypeScript", icon: "devicon-typescript-plain colored" },
      { label: "Vite", icon: "devicon-vite-plain colored" },
      { label: "Tailwind", icon: "devicon-tailwindcss-plain colored" },
      { label: "Zustand", customIcon: "/img/icons/logo-zustand.png" },
    ],
    links: [
      { label: "Live", href: "https://in-the-cave-five.vercel.app/" },
      { label: "Github", href: "https://github.com/thomas-montout/In-the-cave" },
      { label: "Documentation", href: "/pdf/doc-inthecave.pdf" },
    ],
    category: "personnel",
  },
  {
    slug: "absolute-stream",
    title: "Absolute Stream",
    description:
      "Plateforme communautaire de suivi de films, séries et animés inspirée de Letterboxd, réalisée en binôme autour de l'API TMDB.",
    image: "/img/photos/minia-absolutestream.png",
    techs: [
      { label: "Next.js", icon: "devicon-nextjs-plain colored" },
      { label: "TypeScript", icon: "devicon-typescript-plain colored" },
      { label: "Tailwind CSS", icon: "devicon-tailwindcss-plain colored" },
      { label: "NeonDB", customIcon: "/img/icons/neondb-logo.png" },
      { label: "Prisma", icon: "devicon-prisma-plain colored" },
      { label: "PostgreSQL", icon: "devicon-postgresql-plain colored" },
    ],
    links: [
      { label: "Live", href: "https://absolute-stream.vercel.app/" },
      { label: "Github", href: "https://github.com/thomas-montout/Absolute-Stream" },
      { label: "Documentation", href: "/pdf/doc-abolutestream.pdf" },
    ],
    category: "personnel",
  },
  {
    slug: "v-room",
    title: "V.ROOM",
    description:
      "E-commerce de véhicules en architecture découplée React + API Symfony, avec un assistant IA qui interprète les besoins en langage naturel.",
    image: "/img/photos/minia-vroom.png",
    techs: [
      { label: "Symfony", icon: "devicon-symfony-plain colored" },
      { label: "TypeScript", icon: "devicon-typescript-plain colored" },
      { label: "React", icon: "devicon-react-plain colored" },
      { label: "PostgreSQL", icon: "devicon-postgresql-plain colored" },
    ],
    links: [
      { label: "Live", href: "https://v-room-beta.vercel.app/" },
      { label: "Github", href: "https://github.com/thomas-montout/V.ROOM" },
      { label: "Documentation", href: "/pdf/doc-vroom.pdf" },
    ],
    category: "personnel",
  },
  {
    slug: "pink-monster",
    title: "Pink Monster",
    description:
      "Petit jeu de plateforme 2D en pixel art avec Phaser pour aborder la POO appliquée au jeu vidéo et la gestion d'états.",
    image: "/img/photos/minia-pinkmonster.png",
    techs: [
      { label: "Phaser", customIcon: "/img/icons/phaser-logo.png" },
      { label: "JavaScript", icon: "devicon-javascript-plain colored" },
      { label: "Html", icon: "devicon-html5-plain colored" },
    ],
    links: [
      { label: "Live", href: "https://thomas-montout.github.io/pink-monster/" },
      { label: "Github", href: "https://github.com/thomas-montout/pink-monster" },
    ],
    category: "personnel",
  },
  {
    slug: "faire-part-mariage",
    title: "Faire-part de mariage",
    description:
      "Site faire-part pour un mariage, conçu comme un terrain d'expérimentation pur sur les animations et la mise en scène.",
    image: "/img/photos/minia-fairepart.png",
    techs: [
      { label: "Vite", icon: "devicon-vite-plain colored" },
      { label: "React", icon: "devicon-react-plain colored" },
      { label: "CSS3", icon: "devicon-css3-plain colored" },
    ],
    links: [{ label: "Live", href: "https://nathalieluc.fr/" }],
    category: "personnel",
  },
  {
    slug: "tempo",
    title: "Tempo",
    description:
      "App météo qui change complètement de skin selon les conditions retournées par une API publique.",
    image: "/img/photos/minia-tempo.png",
    techs: [
      { label: "React", icon: "devicon-react-plain colored" },
      { label: "TypeScript", icon: "devicon-typescript-plain colored" },
      { label: "Vite", icon: "devicon-vite-plain colored" },
    ],
    links: [
      { label: "Live", href: "https://tempo-ten-psi.vercel.app/" },
      { label: "Github", href: "https://github.com/thomas-montout/tempo" },
    ],
    category: "personnel",
  },
  {
    slug: "iso-stock",
    title: "ISO Stock",
    description:
      "Application de bureau pour une entreprise de lavage de vitres : savoir quel matériel se trouve dans quel véhicule de la flotte.",
    image: "/img/photos/minia-iso-stock.png",
    techs: [
      { label: "Java", icon: "devicon-java-plain colored" },
      { label: "SQLite", icon: "devicon-sqlite-plain colored" },
      { label: "Maven", icon: "devicon-maven-plain colored" },
      { label: "JUnit", icon: "devicon-junit-plain colored" },
    ],
    links: [{ label: "Github", href: "https://github.com/thomas-montout/parc-vehicules" }],
    category: "personnel",
  },

  // ════════════════════════════════════════════════════════════════════
  // E6 — PLAYZONE
  // Même contexte pour les deux projets : l'entreprise ATM (fictive) développe pour la
  // Mairie de Paris une plateforme de réservation de lieux de loisirs.
  // Squelettes : techs, liens et documentation à compléter au fil du projet.
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "playzone-client-leger",
    title: "PlayZone (client léger)",
    description:
      "Site web où les visiteurs réservent une activité (karting, laser game, escape game, bowling) dans un lieu de loisirs parisien.",
    image: "/img/photos/minia-playzone-client-leger.png",
    techs: [
      { label: "Node.js", icon: "devicon-nodejs-plain colored" },
      { label: "Express", icon: "devicon-express-original" },
      { label: "MySQL", icon: "devicon-mysql-plain colored" },
    ],
    links: [],
    category: "formation",
    epreuve: "E6",
  },
  {
    slug: "playzone-client-lourd",
    title: "PlayZone (client lourd)",
    description:
      "Application de bureau pour les gérants de lieux et les agents de la Ville, reliée à la même base de données que le site.",
    image: "/img/photos/minia-playzone-client-lourd.png",
    techs: [
      { label: "Java", icon: "devicon-java-plain colored" },
      { label: "MySQL", icon: "devicon-mysql-plain colored" },
    ],
    links: [],
    category: "formation",
    epreuve: "E6",
  },
];
// ════════════════════════════════════════════════════════════════════
// HELPERS — évitent de répéter les filtres dans les composants.
// ════════════════════════════════════════════════════════════════════

// Les projets E6 ont leur propre page : on les écarte de tout ce qu'affiche /e5.
const missionsE5 = missions.filter((m) => m.epreuve !== "E6");

export const missionsByCategory = (cat: MissionCategory) =>
  missionsE5.filter((m) => m.category === cat);

// Filtre par bloc BTS SIO (utilisé pour la sous-segmentation de la page formation).
export const missionsByBlock = (block: MissionBlock) => missionsE5.filter((m) => m.block === block);

// Projets affichés sur /e6.
export const missionsE6 = missions.filter((m) => m.epreuve === "E6");
