import { createI18n } from "vue-i18n";
import en from "../locales/en.json";
import de from "../locales/de.json";

type MessageSchema = typeof en & typeof de;

const i18n = createI18n<[MessageSchema], "en" | "de">({
  legacy: false,
  locale: "en",
  messages: {
    en,
    de,
  },
});

export default i18n;
