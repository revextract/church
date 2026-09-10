// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Pages are rendered per request so we can look the church up by hostname
  // and pull its layout out of Postgres.
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ["@church/puck-config"],
      // Prisma must stay external; it loads native query engines at runtime.
      external: ["@prisma/client", ".prisma/client"],
    },
  },
});
