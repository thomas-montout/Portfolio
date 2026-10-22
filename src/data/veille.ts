// Données de la veille technologique, affichées par la page Veille (pages/VeilleTechnologique.tsx).
// Même principe que missions.ts : une seule source de vérité, le composant ne fait que du rendu.
//
// SUJET : l'évolution du RAG (Retrieval-Augmented Generation) vers des agents IA autonomes,
// et les solutions pour les sécuriser en entreprise.
//
// AJOUTER UN ARTICLE = ajouter un objet dans le tableau `articles`, rien d'autre.
// Le tableau est rangé dans l'ordre chronologique. La page regroupe les articles par étape
// du sujet (`etape`) et garde cet ordre à l'intérieur de chaque étape.
// Chaque fiche suit la même structure : métadonnées (média – date), titre,
// « Enjeu » (pourquoi c'est important), puis le résumé factuel, replié par défaut.

// Union de littéraux : TS refuse toute autre valeur dans `categorie`.
export type Categorie = "ARCHITECTURE" | "TECHNIQUE" | "STANDARD" | "SÉCURITÉ" | "GOUVERNANCE";

// Les 3 étapes du sujet : chaque article est rangé dans l'une d'elles.
export type Etape = "lire" | "agir" | "encadrer";

// Le sujet, affiché en tête de page : un titre court et la question posée.
export const sujet = {
  titre: "Le RAG : Sécuriser les IA qui agissent sur le système d'information",
  question:
    "Les IA d'entreprise ne se contentent plus de lire des documents : elles appellent des API et exécutent du code. Comment garder le contrôle ?",
};

// Dans l'ordre d'affichage : le numéro de l'étape vient de sa position dans le tableau.
export const etapes: { id: Etape; titre: string; theme: string; texte: string; icon: string }[] = [
  {
    id: "lire",
    titre: "L'IA lit",
    theme: "RAG",
    texte: "Elle répond à partir des documents de l'entreprise.",
    icon: "fa-solid fa-book-open",
  },
  {
    id: "agir",
    titre: "L'IA agit",
    theme: "Agents IA",
    texte: "Elle choisit ses outils, appelle des API et exécute du code.",
    icon: "fa-solid fa-robot",
  },
  {
    id: "encadrer",
    titre: "On l'encadre",
    theme: "Sécurité",
    texte: "Droits limités, journaux d'activité et isolation par le système.",
    icon: "fa-solid fa-shield-halved",
  },
];

export type Article = {
  titre: string; // mon titre de fiche, en une phrase
  titreOriginal: string; // titre de l'article tel que publié (infobulle de « Lire l'article », pour la traçabilité)
  url: string; // lien vers l'article
  image?: string; // vignette officielle de l'article (balise og:image), chargée depuis le site du média
  source: string; // média qui l'a publié
  date: string; // format ISO "AAAA-MM-JJ"
  categorie: Categorie;
  etape: Etape; // étape du sujet à laquelle l'article se rattache
  resume: string; // résumé factuel, 2 phrases maximum
  pourquoi: string; // impact pour un développeur SLAM ou pour le SI, en une phrase
  aLaUne?: boolean; // fiche mise en avant (les deux plus récentes, au cœur de l'oral)
  voirAussi?: { titre: string; url: string; source: string }; // article complémentaire, lié sous la fiche
};

// Les outils qui collectent l'information pour moi.
export const outils: { nom: string; role: string }[] = [
  { nom: "Feedly", role: "rassemble les flux RSS de mes sources au même endroit" },
  {
    nom: "Google Alerts",
    role: "m'envoie un e-mail quand un mot-clé du sujet apparaît sur le web",
  },
  {
    nom: "Flux RSS (Journal du Net, ByteByteGo, LogRocket, TLDR AI)",
    role: "lus en direct par cette page, via une fonction serveur (sans service tiers)",
  },
];

// Les médias que je suis.
export const sources: { nom: string; url: string }[] = [
  { nom: "LogRocket Blog", url: "https://blog.logrocket.com/" },
  { nom: "DEV Community", url: "https://dev.to/" },
  { nom: "ByteByteGo", url: "https://blog.bytebytego.com/" },
  { nom: "TLDR AI", url: "https://tldr.tech/ai" },
  { nom: "Blog Model Context Protocol", url: "https://blog.modelcontextprotocol.io/" },
  { nom: "Journal du Net", url: "https://www.journaldunet.com/" },
  { nom: "Windows Developer Blog", url: "https://blogs.windows.com/windowsdeveloper/" },
];

export const articles: Article[] = [
  // ─── 1. Le RAG « naïf » ───
  {
    titre: "Le RAG arrive dans le front : un chatbot qui répond avec les données de l'entreprise",
    titreOriginal: "How to build smarter frontend chatbots with RAG and LangChain.js",
    url: "https://blog.logrocket.com/frontend-chatbots-rag-langchain/",
    image: "https://blog.logrocket.com/wp-content/uploads/2025/09/chatbots-langchain-rag.png",
    source: "LogRocket Blog",
    date: "2025-09-18",
    categorie: "ARCHITECTURE",
    etape: "lire",
    resume:
      "Le tutoriel construit un chatbot Next.js avec LangChain.js selon le schéma RAG de base : retrouver les passages utiles dans une base de connaissances, puis laisser le LLM rédiger la réponse. Les documents y sont stockés sous forme d'embeddings, des vecteurs qui représentent le sens du texte.",
    pourquoi:
      "c'est le point de départ de mon sujet : une IA qui ne fait que lire, mais qui ajoute au SI une nouvelle brique, la base vectorielle, interrogée par proximité de sens et non en SQL.",
  },

  // ─── 2. Le défi du découpage ───
  {
    titre:
      "Découper au hasard ne suffit plus : le chunking sémantique remet de l'ordre dans le contexte",
    titreOriginal:
      "Building a Local RAG for Agentic Coding: From Fixed Chunks to Semantic Search with Keyword Boost",
    url: "https://dev.to/shinpr/building-a-local-rag-for-agentic-coding-from-fixed-chunks-to-semantic-search-with-keyword-boost-15m8",
    image:
      "https://media2.dev.to/dynamic/image/width=1000,height=500,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fkos5brkcpfsh4vv5z6xo.png",
    source: "DEV Community",
    date: "2026-01-06",
    categorie: "TECHNIQUE",
    etape: "lire",
    resume:
      "Avec des morceaux de texte de taille fixe, le RAG renvoie beaucoup de passages hors sujet. L'auteur passe à un découpage sémantique, qui regroupe les phrases selon leur sens, et favorise les passages qui contiennent les mots-clés de la question.",
    pourquoi:
      "la qualité d'un RAG se joue dès la préparation des données : un bon découpage donne des réponses plus pertinentes et coûte moins cher.",
  },

  // ─── 3. Le RAG devient agentique ───
  {
    titre:
      "Le RAG devient une boucle : l'IA choisit elle-même où chercher, et recommence si besoin",
    titreOriginal: "How Agentic RAG Works?",
    url: "https://blog.bytebytego.com/p/how-agentic-rag-works",
    image:
      "https://substackcdn.com/image/fetch/$s_!GBmV!,w_1200,h_675,c_fill,f_jpg,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F04374532-7256-4435-91c5-9914cddcb7e5_2066x1322.png",
    source: "ByteByteGo",
    date: "2026-03-23",
    categorie: "ARCHITECTURE",
    etape: "agir",
    resume:
      "Le RAG classique cherche une seule fois puis répond, sans vérifier ce qu'il a trouvé. Le RAG agentique ajoute un agent qui choisit où chercher (base de données, documents, API), juge les résultats et recommence si besoin, au prix d'un coût 3 à 10 fois plus élevé.",
    pourquoi:
      "l'IA ne se contente plus de lire : elle décide quelles requêtes lancer sur le SI, ce qui la rend plus difficile à tester.",
  },

  // ─── 4. Suivre les relations : GraphRAG ───
  {
    titre:
      "GraphRAG : le RAG suit les liens entre les données au lieu de chercher du texte qui se ressemble",
    titreOriginal: "Graph RAG explained: Relationship-aware retrieval",
    url: "https://blog.logrocket.com/graph-rag-relationship-retrieval/",
    image:
      "https://blog.logrocket.com/wp-content/uploads/2026/04/Graph-RAG-explained-Relationship-aware-retrieval.png",
    source: "LogRocket Blog",
    date: "2026-04-29",
    categorie: "ARCHITECTURE",
    etape: "lire",
    resume:
      "Le RAG vectoriel récupère des morceaux de texte isolés et échoue quand il faut croiser plusieurs informations. Le GraphRAG relie les entités dans un graphe et répond en « suivant les liens », avec une base comme Neo4j en production.",
    pourquoi:
      "c'est une logique proche des jointures SQL, mais il faut modéliser entités et relations, un peu comme un MCD.",
  },

  // ─── 5. Un standard pour connecter les IA au SI ───
  {
    titre:
      "MCP passe sans état : brancher une IA sur un outil devient un développement d'API comme les autres",
    titreOriginal: "The 2026-07-28 Specification",
    url: "https://blog.modelcontextprotocol.io/posts/2026-07-28/",
    image: "https://blog.modelcontextprotocol.io/og-image.png",
    source: "Blog Model Context Protocol",
    date: "2026-07-28",
    categorie: "STANDARD",
    etape: "agir",
    resume:
      "MCP est le protocole standard qui relie les IA aux outils et aux données de l'entreprise. Sa version du 28 juillet 2026 le rend sans état : n'importe quel serveur peut traiter une requête, comme pour une API web classique.",
    pourquoi:
      "exposer une application métier aux agents devient un développement d'API standard, donc aussi un point d'entrée à sécuriser.",
  },

  // ─── 6. Des agents qui agissent sans laisser de traces ───
  {
    titre:
      "Des agents qui agissent sans laisser de traces : la télémétrie devient le chaînon manquant",
    titreOriginal:
      "David Girard (TrendAI) : « Beaucoup de fournisseurs ont livré des IA bâclées, sans la télémétrie nécessaire »",
    url: "https://www.journaldunet.com/cybersecurite/1554713-beaucoup-de-fournisseurs-ont-livre-des-ia-baclees-sans-la-telemetrie-necessaire/",
    image:
      "https://img-0.journaldunet.com/9_gHytn2q9gfgAZ1Xf02NK0FzoY=/1500x/smart/facefaf4557c483a93189c9643348466/ccmcms-jdn/39543591.jpg",
    source: "Journal du Net",
    date: "2026-09-10",
    categorie: "SÉCURITÉ",
    etape: "encadrer",
    resume:
      "Un groupe de travail de la CoSAI définit les journaux qu'une IA devrait produire : appels d'outils, scripts exécutés, échanges entre agents. Selon David Girard (TrendAI), beaucoup d'outils d'agents n'en produisent pas assez, et les clients y ont rarement accès.",
    pourquoi:
      "dès qu'un agent agit sur le SI, il faut pouvoir retracer quel outil il a appelé, avec quels paramètres et quel résultat.",
  },

  // ─── 7. La gouvernance ne suit pas ───
  {
    titre: "Les entreprises génèrent des logs d'IA, mais presque personne ne les surveille",
    titreOriginal: "Cybersécurité : les responsables sécurité face au mur de l'IA agentique",
    url: "https://www.journaldunet.com/cybersecurite/1555649-cybersecurite-les-responsables-securite-face-au-mur-de-l-ia-agentique/",
    image:
      "https://img-0.journaldunet.com/27oiyFMGlsU1psFLS0GWPKqsKu8=/1500x/smart/673ab8cb7f374ffc88a757a9e41ac324/user-jdn/39544308-gerome-billois.jpg",
    source: "Journal du Net",
    date: "2026-10-01",
    categorie: "GOUVERNANCE",
    etape: "encadrer",
    aLaUne: true,
    resume:
      "Selon Wavestone, 9 entreprises sur 10 enregistrent l'activité de leurs IA, mais seules 8 % envoient ces journaux à leur SOC. Peu gèrent les agents comme de vrais utilisateurs (15 %) ou ont un plan d'incident IA (12,5 %).",
    pourquoi:
      "avec l'AI Act, il faudra prouver la supervision : chaque agent doit avoir son propre compte, des droits limités et des journaux exploitables par l'équipe sécurité.",
    voirAussi: {
      titre: "AI Act : les 7 règles à respecter dès maintenant (et les 2 à venir)",
      url: "https://www.journaldunet.com/intelligence-artificielle/1554407-ai-act-les-7-regles-a-respecter-des-maintenant-et-les-2-a-venir/",
      source: "Journal du Net, 4 septembre 2026",
    },
  },

  // ─── 8. L'isolation par le système d'exploitation ───
  {
    titre:
      "Windows 11 enferme les agents IA dans des conteneurs : c'est l'OS qui décide de ce qu'ils peuvent toucher",
    titreOriginal: "Microsoft Execution Containers: Policy-driven containment for AI agents",
    url: "https://blogs.windows.com/windowsdeveloper/2026/10/07/microsoft-execution-containers-policy-driven-containment-for-ai-agents/",
    image: "https://winblogs.thesourcemediaassets.com/sites/3/2026/10/MXC_OAT.png",
    source: "Windows Developer Blog",
    date: "2026-10-07",
    categorie: "SÉCURITÉ",
    etape: "encadrer",
    aLaUne: true,
    resume:
      "Avec MXC, Microsoft isole dans des conteneurs le code lancé par les agents IA. Une politique JSON, que l'agent ne peut pas modifier, fixe les fichiers et les adresses réseau auxquels il a accès, et les opérations bloquées sont journalisées.",
    pourquoi:
      "c'est la réponse technique à mon sujet : le moindre privilège est appliqué par le système d'exploitation, et l'agent devient traçable.",
  },
];
