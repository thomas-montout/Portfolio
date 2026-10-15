import { defineConfig, type Connect, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { GET as rssGet } from "./api/rss";

// /api/rss en local (flux RSS de la page Veille).
// En production, /api/rss est servi par la fonction serverless api/rss.ts (Vercel).
// Vite ne sait pas exécuter ces fonctions tout seul : ce petit plugin branche la MÊME
// fonction GET sur la même URL du serveur local. Un seul code, en dev comme en prod.
function apiRss(): Plugin {
  // Middleware = fonction appelée pour chaque requête qui arrive sur /api/rss.
  // On appelle GET(), puis on recopie sa Response (statut, type, contenu) dans la réponse du serveur.
  const middleware: Connect.NextHandleFunction = async (_req, res) => {
    const response = await rssGet();
    res.statusCode = response.status;
    res.setHeader("Content-Type", response.headers.get("Content-Type") ?? "text/plain");
    res.end(await response.text());
  };

  // Accolades obligatoires : si configureServer RENVOIE une fonction, Vite la prend pour un
  // « post-hook » et l'exécute. Or middlewares.use() renvoie le serveur, qui est une fonction.
  return {
    name: "api-rss",
    configureServer(server) {
      server.middlewares.use("/api/rss", middleware); // npm run dev
    },
    configurePreviewServer(server) {
      server.middlewares.use("/api/rss", middleware); // npm run preview
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), apiRss()],
});
