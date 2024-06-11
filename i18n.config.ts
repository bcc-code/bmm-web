import de from "./locales/de.json";
import en from "./locales/en.json";
import nb from "./locales/nb.json";
import nl from "./locales/nl.json";
import sl from "./locales/sl.json";
import tr from "./locales/tr.json";
import fr from "./locales/fr.json";
import ta from "./locales/ta.json";
import da from "./locales/da.json";

export default defineI18nConfig(() => ({
  legacy: false,
  messages: {
    nb,
    en,
    de,
    nl,
    fr,
    sl,
    tr,
    ta,
    da,
  },
}));
