import type availableContentLanguages from "./availableContentLanguages";

type ILanguageInfo = {
  EnglishName: string;
  NativeName: string;
};

const languageDictionary: {
  [key in (typeof availableContentLanguages)[number]]: ILanguageInfo;
} = {
  af: { EnglishName: "Afrikaans", NativeName: "Afrikaans" },
  bg: { EnglishName: "Bulgarian", NativeName: "български" },
  cs: { EnglishName: "Czech", NativeName: "čeština" },
  da: { EnglishName: "Danish", NativeName: "dansk" },
  de: { EnglishName: "German", NativeName: "Deutsch" },
  en: { EnglishName: "English", NativeName: "English" },
  el: { EnglishName: "Greek", NativeName: "Ελληνικά" },
  es: { EnglishName: "Spanish", NativeName: "español" },
  et: { EnglishName: "Estonian", NativeName: "eesti" },
  fr: { EnglishName: "French", NativeName: "Français" },
  fi: { EnglishName: "Finnish", NativeName: "suomi" },
  he: { EnglishName: "Hebrew", NativeName: "עברית" },
  hr: { EnglishName: "Croatian", NativeName: "hrvatski" },
  hu: { EnglishName: "Hungarian", NativeName: "magyar" },
  it: { EnglishName: "Italian", NativeName: "italiano" },
  kha: { EnglishName: "Khasi", NativeName: "Khasi" },
  nb: { EnglishName: "Norwegian", NativeName: "Norsk" },
  nl: { EnglishName: "Dutch", NativeName: "Nederlands" },
  ml: { EnglishName: "Malayalam", NativeName: "മലയ\u0D3Eള\u0D02" },
  pl: { EnglishName: "Polish", NativeName: "polski" },
  pt: { EnglishName: "Portuguese", NativeName: "português" },
  ro: { EnglishName: "Romanian", NativeName: "română" },
  ru: { EnglishName: "Russian", NativeName: "русский" },
  sl: { EnglishName: "Slovenian", NativeName: "slovenščina" },
  ta: { EnglishName: "Tamil", NativeName: "தம\u0BBFழ\u0BCD" },
  tr: { EnglishName: "Turkish", NativeName: "Türkçe" },
  zh: { EnglishName: "Chinese (Simplified)", NativeName: "中文" },
  yue: { EnglishName: "Cantonese", NativeName: "廣東話" },
};

export default languageDictionary;
