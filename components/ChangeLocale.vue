<script setup lang="ts">
type ILanguageInfo = {
  EnglishName: string;
  NativeName: string;
};
const dictionary: { [key: string]: ILanguageInfo } = {
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
  nb: { EnglishName: "Norwegian", NativeName: "norsk bokmål" },
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
  uk: { EnglishName: "Ukrainian", NativeName: "українська" },
  yue: { EnglishName: "Cantonese", NativeName: "廣東話" },
};
</script>
<template>
  <div
    class="text-label-1 bg-background-1 min-w-[100px] px-2 py-1.5 rounded-lg font-semibold shadow-[0_4px_12px_0_#0000000D,0_1px_4px_0_#0000000D,0_0_0_1px_#0000000D]"
  >
    <select v-model="$i18n.locale" class="py-1">
      <option
        v-for="(lang, i) in $i18n.availableLocales"
        :key="`Lang${i}`"
        :value="lang"
      >
        {{
          `${dictionary[lang]?.NativeName} (${dictionary[lang]?.EnglishName})`
        }}
      </option>
    </select>
  </div>
</template>
