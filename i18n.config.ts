import de from "./locales/de.json";
import en from "./locales/en.json";
import nb from "./locales/nb.json";
import nl from "./locales/nl.json";

export default defineI18nConfig(() => ({
  legacy: false,
  messages: {
    de,
    en,
    nb,
    nl,
  },
}));
