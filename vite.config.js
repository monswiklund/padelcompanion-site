import { defineConfig } from "vite";
import { resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/", // Change to '/repo-name/' if using project pages
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "Padel Tournament",
        short_name: "Padel Tournament",
        description:
          "Generate Americano and Mexicano padel tournament schedules",
        theme_color: "#0a0a0f",
        background_color: "#0a0a0f",
        display: "standalone",
        orientation: "portrait",
        start_url: "/tournament/",
        scope: "/",
        icons: [
          {
            src: "/assets/app-icon.jpeg",
            sizes: "192x192",
            type: "image/jpeg",
            purpose: "any maskable",
          },
          {
            src: "/assets/app-icon.jpeg",
            sizes: "512x512",
            type: "image/jpeg",
            purpose: "any",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpeg,woff,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@shared": resolve(__dirname, "src/shared"),
      "@tournament": resolve(__dirname, "src/tournament"),
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "index.html",
        privacy: "privacy.html",
        terms: "terms.html",
        support: "support.html",
        tournament: "tournament/index.html",
      },
    },
  },
});
