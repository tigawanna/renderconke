import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite-plus";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, fileURLToPath(new URL(".", import.meta.url)), "");
  const host = (env.VITE_SITE_URL || "https://rendercon.org").replace(/\/$/, "");

  return {
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
      tailwindcss(),
      tanstackStart({
        prerender: {
          enabled: true,
          crawlLinks: true,
        },
        sitemap: {
          enabled: true,
          host,
        },
      }),
      viteReact(),
    ],
  };
});
