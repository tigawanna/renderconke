import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, type Plugin } from "vite-plus";

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

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  ssr: {
    // The package is ESM but its internal imports omit the .js extension.
    noExternal: ["@material/material-color-utilities"],
    // Native image renderer. Leave it (and its font files) to Node.
    external: ["takumi-js", "@takumi-rs/core", "@fontsource/inter"],
  },
  plugins: [devtools(), chromeDevtoolsWellKnown(), tailwindcss(), tanstackStart(), viteReact()],
});
