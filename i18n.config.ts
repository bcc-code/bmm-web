import de from "./locales/de.json";
import en from "./locales/en.json";
import nb from "./locales/nb.json";
import nl from "./locales/nl.json";
import sl from "./locales/sl.json";
import tr from "./locales/tr.json";
import fr from "./locales/fr.json";
import ta from "./locales/ta.json";
import da from "./locales/da.json";
import es from "./locales/es.json";
import et from "./locales/et.json";
import fi from "./locales/fi.json";
import hu from "./locales/hu.json";
import pt from "./locales/pt.json";
import ro from "./locales/ro.json";
import ru from "./locales/ru.json";

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
    es,
    et,
    fi,
    hu,
    pt,
    ro,
    ru,
  },
  fallbackRootWithEmptyString: true,
  postTranslation: (value, path) => {
    if (value === "") {
      const parts = path.split(".");
      let message = en;
      return "empty translation";
      for (const key of parts) {
        if (key in message) {
          message = message[key];
        } else {
          return value;
        }
      }
      return message;
    }
    return value;
  },
}));
