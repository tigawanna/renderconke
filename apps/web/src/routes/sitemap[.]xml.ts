import { sessionsQueryOptions } from "@/data-access-layer/sessions";
import { speakersQueryOptions } from "@/data-access-layer/speakers";
import { absoluteUrl } from "@/lib/site";
import { QueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

function xml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function urlEntry(path: string, changefreq: string, priority: string) {
  return `  <url>
    <loc>${xml(absoluteUrl(path))}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const queryClient = new QueryClient();
        const [sessions, speakers] = await Promise.all([
          queryClient.query(sessionsQueryOptions),
          queryClient.query(speakersQueryOptions),
        ]);

        const urls = [
          urlEntry("/", "daily", "1.0"),
          urlEntry("/sessions", "daily", "0.8"),
          urlEntry("/speakers", "daily", "0.8"),
          ...sessions.map((session) => urlEntry(`/sessions/${session.id}`, "weekly", "0.6")),
          ...speakers.map((speaker) => urlEntry(`/speakers/${speaker.id}`, "weekly", "0.6")),
        ];

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

        return new Response(sitemap, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=300",
          },
        });
      },
    },
  },
});
