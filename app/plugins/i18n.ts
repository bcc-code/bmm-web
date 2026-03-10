import { createI18n } from "vue-i18n";
import da from "../locales/da.json";
import de from "../locales/de.json";
import el from "../locales/el.json";
import en from "../locales/en.json";
import es from "../locales/es.json";
import et from "../locales/et.json";
import fi from "../locales/fi.json";
import fr from "../locales/fr.json";
import hu from "../locales/hu.json";
import it from "../locales/it.json";
import nb from "../locales/nb.json";
import nl from "../locales/nl.json";
import pl from "../locales/pl.json";
import pt from "../locales/pt.json";
import ro from "../locales/ro.json";
import ru from "../locales/ru.json";
import sl from "../locales/sl.json";
import ta from "../locales/ta.json";
import tr from "../locales/tr.json";

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
	globalInjection: true,
	locale: "en",
	messages: {
		da,
		de,
		el,
		en,
		es,
		et,
		fi,
		fr,
		hu,
		it,
		nb,
		nl,
		pl,
		pt,
		ro,
		ru,
		sl,
		ta,
		tr
	},
  });
  vueApp.use(i18n);
});
