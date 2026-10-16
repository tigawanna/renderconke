import { OgCard } from "@/components/og-card";
import { siteConfig } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Renderer } from "takumi-js/node";
import { ImageResponse } from "takumi-js/response";

const require = createRequire(import.meta.url);

function readAsset(candidates: string[]) {
  const path = candidates.find((candidate) => existsSync(candidate));
  if (!path) throw new Error(`Missing asset. Looked in ${candidates.join(", ")}`);
  return readFileSync(path);
}

const logoSrc = `data:image/png;base64,${readAsset([
  fileURLToPath(new URL("../../public/rendercon.png", import.meta.url)),
  join(process.cwd(), "public/rendercon.png"),
  join(process.cwd(), "apps/web/public/rendercon.png"),
]).toString("base64")}`;

const renderer = new Renderer();
const fontsReady = Promise.all(
  [400, 700].map((weight) =>
    renderer.registerFont({
      name: "Inter",
      weight,
      data: readAsset([
        require.resolve(`@fontsource/inter/files/inter-latin-${weight}-normal.woff2`),
      ]),
    }),
  ),
);

function field(url: URL, key: string, fallback: string, max: number) {
  const value = url.searchParams.get(key)?.replace(/\s+/g, " ").trim();
  if (!value) return fallback;
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}…`;
}

export const Route = createFileRoute("/og.png")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        await fontsReady;
        const url = new URL(request.url);
        const title = field(url, "title", `${siteConfig.eventName} ${siteConfig.year}`, 90);
        const date = field(url, "date", siteConfig.dates.displayDate, 80);
        const location = field(url, "location", siteConfig.venue.fullAddress, 160);
        const detail = url.searchParams.get("detail")?.replace(/\s+/g, " ").trim();

        return new ImageResponse(
          <OgCard
            title={title}
            date={date}
            location={location}
            website="rendercon.org"
            detail={detail || undefined}
            logoSrc={logoSrc}
          />,
          {
            width: 1200,
            height: 630,
            format: "png",
            renderer,
            headers: {
              "Cache-Control": "public, max-age=86400",
            },
          },
        );
      },
    },
  },
});
