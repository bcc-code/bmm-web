// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/devtools",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/i18n",
    ["@pinia/nuxt", { autoImports: ["defineStore"] }],
    "nuxt-icons"
  ],
  runtimeConfig: {
    public: {
      apiUrl: "https://bmm-api.brunstad.org",
      authUrl: "https://login.bcc.no",
      clientId: "L9891KdcqtoKmHg4r65lT7zbSjv55dNN",
    },
  },
  i18n: {
    defaultLocale: "en",
    vueI18n: "i18n.config.ts",
  },
  imports: {
    dirs: ["stores"],
  },
  // TODO: Remove after https://github.com/nuxt-modules/i18n/issues/2000 is fixed
  ssr: false,
  vite: {
    // https://stackoverflow.com/a/75655669/517914
    optimizeDeps: { exclude: ["fsevents"] },
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
});
