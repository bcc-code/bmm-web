import type { LocaleMessage } from "@intlify/core";
import type { VueMessageType } from "vue-i18n";
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
import it from "./locales/it.json";
import pl from "./locales/pl.json";

function cleanupEmptyProperties(obj: any, fallback: any): any {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object") {
      obj[key] = cleanupEmptyProperties(obj[key], fallback[key]);
    }
    if (obj[key] === "") {
      obj[key] = fallback[key];
    }
  });
  return obj;
}

function cleanup(
  locale: LocaleMessage<VueMessageType>,
  fallback: LocaleMessage<VueMessageType>,
): LocaleMessage<VueMessageType> {
  Object.keys(locale).forEach((key) => {
    if (typeof locale[key] === "object") {
      locale[key] = cleanupEmptyProperties(locale[key], fallback[key]);
    }
  });
  return locale;
}

export default defineI18nConfig(() => ({
  legacy: false,
  messages: {
    nb: cleanup(nb, en),
    en,
    da: cleanup(da, en),
    de: cleanup(de, en),
    es: cleanup(es, en),
    et: cleanup(et, en),
    fi: cleanup(fi, en),
    fr: cleanup(fr, en),
    hu: cleanup(hu, en),
    it: cleanup(it, en),
    nl: cleanup(nl, en),
    pl: cleanup(pl, en),
    pt: cleanup(pt, en),
    ro: cleanup(ro, en),
    ru: cleanup(ru, en),
    sl: cleanup(sl, en),
    ta: cleanup(ta, en),
    tr: cleanup(tr, en),
  },
}));
