// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@nuxt/ui", "@pinia/nuxt", "@nuxtjs/i18n"],

  extends: [
    "./layers/shared",
    "./layers/authentication",
    "./layers/authorization",
  ],

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],
  i18n: {
    langDir: "./locales",
    locales: [
      { code: "en", language: "en", file: "en.json" },
      { code: "ar", language: "ar", file: "ar.json" },
    ],
    defaultLocale: "ar",
  },
  routeRules: {
    "/": { prerender: true },
  },

  compatibilityDate: "2025-01-15",

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
  runtimeConfig: {
    public: {
      apiBase: "http://localhost:8085/api",
    },
  },
});
