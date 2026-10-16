import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv, type Plugin } from "vite-plus";

const chromeDevtoolsWellKnown = (): Plugin => ({
  name: "chrome-devtools-well-known",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const path = req.url?.split("?")[0];
      if (path !== "/.well-known/appspecific/com.chrome.devtools.json") {
        next();
        return;
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end("{}");
    });
  },
});

const SESSIONIZE = "https://sessionize.com/api/v2/c1nslc55/view";

function xml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function urlEntry(siteUrl: string, path: string, changefreq: string, priority: string) {
  const loc = new URL(path, `${siteUrl}/`).toString();
  return `  <url>
    <loc>${xml(loc)}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const staticSitemap = (mode: string): Plugin => ({
  name: "static-sitemap",
  apply: "build",
  async generateBundle() {
    if (this.environment?.name !== "client") return;
    const env = loadEnv(mode, fileURLToPath(new URL(".", import.meta.url)), "");
    const siteUrl = (env.VITE_SITE_URL || "https://rendercon.org").replace(/\/$/, "");
    const [sessionsResponse, speakersResponse] = await Promise.all([
      fetch(`${SESSIONIZE}/Sessions`),
      fetch(`${SESSIONIZE}/Speakers`),
    ]);
    if (!sessionsResponse.ok || !speakersResponse.ok) {
      throw new Error("Sessionize did not return the programme for the sitemap");
    }
    const groups = (await sessionsResponse.json()) as {
      sessions: { id: string; isServiceSession: boolean }[];
    }[];
    const speakers = (await speakersResponse.json()) as { id: string }[];
    const sessions = groups
      .flatMap((group) => group.sessions)
      .filter((session) => !session.isServiceSession);
    const urls = [
      urlEntry(siteUrl, "/", "daily", "1.0"),
      urlEntry(siteUrl, "/sessions", "daily", "0.8"),
      urlEntry(siteUrl, "/speakers", "daily", "0.8"),
      ...sessions.map((session) => urlEntry(siteUrl, `/sessions/${session.id}`, "weekly", "0.6")),
      ...speakers.map((speaker) => urlEntry(siteUrl, `/speakers/${speaker.id}`, "weekly", "0.6")),
    ];
    this.emitFile({
      type: "asset",
      fileName: "sitemap.xml",
      source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`,
    });
  },
});

export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  ssr: {
    // The package is ESM but its internal imports omit the .js extension.
    noExternal: ["@material/material-color-utilities"],
  },
  plugins: [
    devtools(),
    chromeDevtoolsWellKnown(),
    staticSitemap(mode),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
}));
