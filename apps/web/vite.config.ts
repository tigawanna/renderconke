import { fileURLToPath, URL } from "node:url";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
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
  plugins: [chromeDevtoolsWellKnown(), tanstackStart(), viteReact()],
});
