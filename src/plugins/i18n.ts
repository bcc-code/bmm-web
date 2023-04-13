import { createI18n } from "vue-i18n";
import af from "../locales/af.json";
import bg from "../locales/bg.json";
import cs from "../locales/cs.json";
import da from "../locales/da.json";
import de from "../locales/de.json";
import el from "../locales/el.json";
import en from "../locales/en.json";
import es from "../locales/es.json";
import et from "../locales/et.json";
import fi from "../locales/fi.json";
import fr from "../locales/fr.json";
import he from "../locales/he.json";
import hr from "../locales/hr.json";
import hu from "../locales/hu.json";
import it from "../locales/it.json";
import nb from "../locales/nb.json";
import nl from "../locales/nl.json";
import pl from "../locales/pl.json";
import pt from "../locales/pt.json";
import ro from "../locales/ro.json";
import ru from "../locales/ru.json";
import sl from "../locales/sl.json";
import tr from "../locales/tr.json";
import uk from "../locales/uk.json";
import zh from "../locales/zh.json";

const i18n = createI18n<
  [{}],
  | "af"
  | "bg"
  | "cs"
  | "da"
  | "de"
  | "el"
  | "en"
  | "es"
  | "et"
  | "fi"
  | "fr"
  | "he"
  | "hr"
  | "hu"
  | "it"
  | "nb"
  | "nl"
  | "pl"
  | "pt"
  | "ro"
  | "ru"
  | "sl"
  | "tr"
  | "uk"
  | "zh",
  false
>({
  legacy: false,
  locale: "en",
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
});

export default i18n;
