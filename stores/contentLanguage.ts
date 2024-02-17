import { LanguageEnum } from "@bcc-code/bmm-sdk-fetch";

export const contentLanguageStore = defineStore(
  "contentLanguage",
  () => {
    const contentLanguages = ref(["nb", "en", "zxx"]);
    const selectedLanguage = ref<LanguageEnum>(LanguageEnum.Nb);

    return { contentLanguages, selectedLanguage };
  },
  {
    persist: true,
  },
);
