// Données de la veille technologique, affichées par la section Veille (pages/VeilleTechnologique.tsx).
// Même principe que missions.ts : une seule source de vérité, le composant ne fait que du rendu.
//
// AJOUTER UN ARTICLE = ajouter un objet dans le tableau `articles`, rien d'autre.
// « À la une » se recalcule tout seul : ce sont toujours les 2 articles les plus récents,
// les autres sont rangés dans leur axe.

// Les 3 axes d'analyse. Union de littéraux : TS refuse toute autre valeur dans `axe`.
export type VeilleAxe = "exemples" | "technique" | "risques";

export type Article = {
  title: string; // titre original de l'article
  url: string; // lien vers l'article
  image?: string; // image de l'article, chargée depuis le site du média (facultative)
  source: string; // média qui l'a publié
  date: string; // format ISO "AAAA-MM-JJ" : se trie comme du texte, dans l'ordre chronologique
  axe: VeilleAxe;
  resume: string; // résumé en 2 lignes
  pourquoi: string; // pourquoi c'est important, en une phrase
};

// Axes dans l'ordre d'affichage. label = version courte, affichée en badge dans « À la une ».
// icon = icône Font Awesome, affichée à la place de l'image quand un article n'en a pas.
export const axes: {
  key: VeilleAxe;
  label: string;
  title: string;
  description: string;
  icon: string;
}[] = [
  {
    key: "exemples",
    label: "Exemples",
    title: "Les exemples concrets",
    description:
      "Quels logiciels intègrent de l'IA, et pour quoi faire : résumer des mails, répondre aux clients, aider à coder…",
    icon: "fa-solid fa-lightbulb",
  },
  {
    key: "technique",
    label: "Technique",
    title: "Comment ça marche techniquement",
    description: "Le logiciel envoie une question à l'IA via une API et récupère la réponse.",
    icon: "fa-solid fa-plug",
  },
  {
    key: "risques",
    label: "Risques",
    title: "Les risques",
    description: "Fuite de données, erreurs de l'IA, respect du RGPD.",
    icon: "fa-solid fa-shield-halved",
  },
];

// Les outils qui collectent l'information pour moi.
export const outils: { nom: string; role: string }[] = [
  { nom: "Feedly", role: "rassemble les flux RSS de mes sources au même endroit" },
  {
    nom: "Google Alerts",
    role: "m'envoie un e-mail quand un mot-clé du sujet apparaît sur le web",
  },
  { nom: "RSS.app", role: "génère le flux affiché en direct sur cette page" },
];

// Les médias que je suis.
export const sources: { nom: string; url: string }[] = [
  { nom: "Blog Mistral AI", url: "https://mistral.ai/news/" },
  { nom: "LeMagIT", url: "https://www.lemagit.fr/" },
  { nom: "Journal du Net", url: "https://www.journaldunet.com/" },
  { nom: "Le Monde Informatique", url: "https://www.lemondeinformatique.fr/" },
];

export const articles: Article[] = [
  // ─── Les exemples concrets ───
  {
    title: "Mistral and Mozilla are bringing open, private and multilingual AI to your web browser",
    url: "https://mistral.ai/news/mistral-x-mozilla/",
    image: "https://mistral.ai/cms-media/api/media/file/Linkedin-Partnership-Firefox%20copie.jpg",
    source: "Blog Mistral AI",
    date: "2026-09-16",
    axe: "exemples",
    resume:
      "Firefox intègre les modèles de Mistral dans Smart Window, son assistant de navigation : il aide à comprendre une recherche ou à retrouver une info dans ses onglets. Par défaut, les conversations ne sont pas conservées.",
    pourquoi:
      "Un éditeur peut ajouter de l'IA à son logiciel sans créer son propre modèle : il s'appuie sur un fournisseur spécialisé.",
  },
  {
    title: "Après l'automatisation, les services clients adoptent les agents IA",
    url: "https://www.lemondeinformatique.fr/actualites/lire-apres-l-automatisation-les-services-clients-adoptent-les-agents-ia-99002.html",
    // Pas d'image : celle de l'article est la photo de l'auteur (tribune).
    source: "Le Monde Informatique",
    date: "2026-01-16",
    axe: "exemples",
    resume:
      "Les chatbots classiques atteignent leurs limites face aux demandes complexes. Les services clients passent à des agents IA qui traitent une demande de bout en bout, connectés au CRM et au ticketing.",
    pourquoi:
      "Répondre aux clients est l'un des usages les plus répandus de l'IA en entreprise, à condition de la brancher sur les logiciels existants.",
  },

  // ─── Comment ça marche techniquement ───
  {
    title: "Agents IA : la plateforme devient le vrai sujet d'architecture",
    url: "https://www.journaldunet.com/intelligence-artificielle/1555615-agents-ia-la-plateforme-devient-le-vrai-sujet-d-architecture/",
    // Pas d'image : celle de l'article est la photo de l'auteur (tribune).
    source: "Journal du Net",
    date: "2026-10-01",
    axe: "technique",
    resume:
      "En production, un agent IA doit être déclenché par des événements, avoir ses propres droits et être supervisé. Microsoft sépare le pilotage des agents de leur exécution, dans des environnements isolés.",
    pourquoi:
      "Intégrer un LLM devient un vrai sujet d'architecture logicielle (droits, traçabilité, supervision), donc un travail de développeur.",
  },
  {
    title: "J'ai construit une équipe d'agents IA pour mon SAV en 6 fichiers Python",
    url: "https://www.journaldunet.com/intelligence-artificielle/1549829-tutoriel-comment-creer-un-systeme-multi-agents-adapte-a-la-relation-client/",
    image:
      "https://img-0.journaldunet.com/TTxKzGXH3-cbBmnZmBiyjJR8UAc=/1500x/smart/7a0446fbfda74e19b27fe855b9b6b6b7/ccmcms-jdn/39538474.png",
    source: "Journal du Net",
    date: "2026-05-21",
    axe: "technique",
    resume:
      "Trois agents (tri, expertise, rédaction) traitent une demande client en Python. Chacun appelle le modèle d'OpenAI via son API et s'appuie sur des documents PDF internes (RAG).",
    pourquoi:
      "Il montre concrètement comment un programme envoie une question à une IA puis exploite sa réponse.",
  },
  {
    title: "Connect the dots: Build with built-in and custom MCPs in Studio",
    url: "https://mistral.ai/news/connectors/",
    image: "https://mistral.ai/cms-media/api/media/file/Thumbnail-Solution-Studio.jpg",
    source: "Blog Mistral AI",
    date: "2026-05-22",
    axe: "technique",
    resume:
      "Mistral permet de brancher des outils (GitHub, Gmail, Salesforce…) ou des serveurs MCP aux appels API de ses modèles. Une option permet d'exiger la validation d'un humain avant que l'IA utilise un outil.",
    pourquoi:
      "Le protocole MCP standardise la façon dont un LLM accède aux données et aux outils d'une entreprise.",
  },

  // ─── Les risques ───
  {
    title: "Agents IA fantômes : ce que les RSSI doivent savoir",
    url: "https://www.lemagit.fr/conseil/Agents-IA-fantomes-ce-que-les-RSSI-doivent-savoir",
    image: "https://www.lemagit.fr/rms/onlineimages/ai_a252657224.jpg",
    source: "LeMagIT",
    date: "2026-09-29",
    axe: "risques",
    resume:
      "Des salariés déploient des agents IA sans l'accord de la DSI, avec un accès direct aux données. Près de la moitié des conversations avec l'IA passent par des comptes personnels.",
    pourquoi:
      "Une IA utilisée hors de tout contrôle devient une porte de sortie pour les données sensibles de l'entreprise.",
  },
  {
    title:
      "IA agentique : la CNIL et le CIANum alertent sur les défis de la protection des données",
    url: "https://www.lemondeinformatique.fr/les-dossiers/lire-ia-agentique-la-cnil-et-le-cianum-alertent-sur-les-defis-de-la-protection-des-donnees-1732.html",
    image: "https://images.itnewsinfo.com/lmi/dossiers/originale/000000108133.jpg",
    source: "Le Monde Informatique",
    date: "2026-07-26",
    axe: "risques",
    resume:
      "Pour agir à la place de l'utilisateur, les agents IA peuvent accéder à ses mails, son agenda ou ses documents. La CNIL et le CIANum rappellent les principes du RGPD et recommandent transparence et supervision humaine.",
    pourquoi:
      "Dès qu'un logiciel envoie des données personnelles à une IA, le RGPD s'applique, et cela se prévoit dès la conception.",
  },
  {
    title: "Devant le juge, qui est responsable des erreurs de l'IA\u00a0?",
    url: "https://www.lemagit.fr/conseil/Devant-le-juge-qui-est-responsable-des-erreurs-de-lIA",
    image:
      "https://www.lemagit.fr/visuals/ComputerWeekly/Hero%20Images/Justice-law-court-davidfranklin-adobe.jpg",
    source: "LeMagIT",
    date: "2026-09-07",
    axe: "risques",
    resume:
      "Une IA ne peut pas être tenue pour responsable : les juges renvoient la faute à l'utilisateur qui reprend une «\u00a0hallucination\u00a0» sans la vérifier. L'éditeur et l'entreprise qui intègre l'IA peuvent partager la responsabilité.",
    pourquoi: "Un logiciel qui intègre un LLM doit prévoir une vérification humaine des réponses.",
  },
];

// ════════════════════════════════════════════════════════════════════
// HELPERS — évitent de répéter le tri et les filtres dans le composant.
// ════════════════════════════════════════════════════════════════════

// Nombre d'articles mis en avant dans « À la une ».
const NB_A_LA_UNE = 2;

// Copie du tableau, triée du plus récent au plus ancien.
// [...articles] = copie, car sort() modifie le tableau sur lequel on l'appelle.
// localeCompare compare deux textes ; b avant a → ordre décroissant.
const articlesParDate = [...articles].sort((a, b) => b.date.localeCompare(a.date));

// Les 2 plus récents → « À la une ».
export const articlesALaUne = articlesParDate.slice(0, NB_A_LA_UNE);

// Tous les autres, filtrés par axe (et donc déjà triés du plus récent au plus ancien).
export const articlesParAxe = (axe: VeilleAxe) =>
  articlesParDate.slice(NB_A_LA_UNE).filter((a) => a.axe === axe);
