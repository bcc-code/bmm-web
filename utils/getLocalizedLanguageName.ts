import type availableContentLanguages from "./availableContentLanguages";

const englishLanguageNames: {
  [key in (typeof availableContentLanguages)[number]]: string;
} = {
  af: "Afrikaans",
  bg: "Bulgarian",
  cs: "Czech",
  da: "Danish",
  de: "German",
  en: "English",
  el: "Greek",
  es: "Spanish",
  et: "Estonian",
  fr: "French",
  fi: "Finnish",
  he: "Hebrew",
  hr: "Croatian",
  hu: "Hungarian",
  it: "Italian",
  kha: "Khasi",
  nb: "Norwegian",
  nl: "Dutch",
  ml: "Malayalam",
  pl: "Polish",
  pt: "Portuguese",
  ro: "Romanian",
  ru: "Russian",
  sl: "Slovenian",
  ta: "Tamil",
  tr: "Turkish",
  zh: "Chinese (Simplified)",
  yue: "Cantonese",
};

function getEnglishLanguageName(k: string) {
  const languageNames: { [key: string]: string } = englishLanguageNames;
  return languageNames[k];
}

export default function getLocalizedLanguageName(
  key: MaybeRef<string>,
  useNativeName?: boolean,
) {
  const { locale } = useI18n();
  const k = unref(key);
  const intl = new Intl.DisplayNames([useNativeName ? k : locale.value], {
    type: "language",
    fallback: "none", // No fallback, that the `of` function returns `undefined` if the browser doesn't support the language.
  });

  return intl.of(k) || getEnglishLanguageName(k) || k;
}
