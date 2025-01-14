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

function cleanupAny(existing: any, fallback: any): any {
  Object.keys(existing).forEach((key) => {
    if (typeof existing[key] === "object") {
      existing[key] = cleanupAny(existing[key], fallback[key]);
    }
    if (existing[key] === "") {
      existing[key] = fallback[key];
    }
  });
  return existing;
}

function cleanup(
  existing: LocaleMessage<VueMessageType>,
  fallback: LocaleMessage<VueMessageType>,
): LocaleMessage<VueMessageType> {
  Object.keys(existing).forEach((key) => {
    if (typeof existing[key] === "object") {
      existing[key] = cleanupAny(existing[key], fallback[key]);
    }
  });
  return existing;
}

export default defineI18nConfig(() => ({
  legacy: false,
  messages: {
    nb: cleanup(nb, en),
    en,
    de: cleanup(de, en),
    nl: cleanup(nl, en),
    fr: cleanup(fr, en),
    sl: cleanup(sl, en),
    tr: cleanup(tr, en),
    ta: cleanup(ta, en),
    da: cleanup(da, en),
    es: cleanup(es, en),
    et: cleanup(et, en),
    fi: cleanup(fi, en),
    hu: cleanup(hu, en),
    pt: cleanup(pt, en),
    ro: cleanup(ro, en),
    ru: cleanup(ru, en),
  },
}));
