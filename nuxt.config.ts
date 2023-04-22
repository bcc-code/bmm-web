// https://nuxt.com/docs/api/configuration/nuxt-config

// Due to a bug in @nuxtjs/i18n@8.0.0-beta.11 we have to use beta.10 with inline configuration. See: https://github.com/nuxt-modules/i18n/issues/1990
// Hopefully when beta.12 is available this can be removed again.
import af from "./locales/af.json";
import bg from "./locales/bg.json";
import cs from "./locales/cs.json";
import da from "./locales/da.json";
import de from "./locales/de.json";
import el from "./locales/el.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import et from "./locales/et.json";
import fi from "./locales/fi.json";
import fr from "./locales/fr.json";
import he from "./locales/he.json";
import hr from "./locales/hr.json";
import hu from "./locales/hu.json";
import it from "./locales/it.json";
import nb from "./locales/nb.json";
import nl from "./locales/nl.json";
import pl from "./locales/pl.json";
import pt from "./locales/pt.json";
import ro from "./locales/ro.json";
import ru from "./locales/ru.json";
import sl from "./locales/sl.json";
import tr from "./locales/tr.json";
import uk from "./locales/uk.json";
import zh from "./locales/zh.json";

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
    vueI18n: {
      legacy: false,
      locale: "en",
      fallbackLocale: "fr",
      messages: {
        af,
        bg,
        cs,
        da,
        de,
        el,
        en,
        es,
        et,
        fi,
        fr,
        he,
        hr,
        hu,
        it,
        nb,
        nl,
        pl,
        pt,
        ro,
        ru,
        sl,
        tr,
        uk,
        zh,
      },
    },
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
