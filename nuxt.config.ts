// https://nuxt.com/docs/api/configuration/nuxt-config
import vueI18n from "./i18n.config";

const modules: (string | any)[] = [
  ["nuxt-typed-router", { strict: true }],
  "@nuxt/devtools",
  "@nuxtjs/tailwindcss",
  "@nuxtjs/i18n",
  ["@pinia/nuxt", { autoImports: ["defineStore"] }],
];

if (process.env.ELECTRON) modules.push(["nuxt-electron"]);

export default defineNuxtConfig({
  modules,
  runtimeConfig: {
    public: {
      apiUrl: "https://bmm-api.brunstad.org",
      authUrl: "https://login.bcc.no",
      clientId: "L9891KdcqtoKmHg4r65lT7zbSjv55dNN",
    },
  },
  i18n: {
    strategy: "no_prefix",
    defaultLocale: "en",
    // Due to a bug in @nuxtjs/i18n@8.0.0-beta.11 we have to use beta.10 with inline configuration. See: https://github.com/nuxt-modules/i18n/issues/1990
    vueI18n,
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
