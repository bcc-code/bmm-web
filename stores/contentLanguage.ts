import { LanguageEnum } from "@bcc-code/bmm-sdk-fetch";

export const contentLanguageStore = defineStore(
  "contentLanguage",
  () => {
    const contentLanguages = ref<LanguageEnum[]>([
      LanguageEnum.Nb,
      LanguageEnum.En,
      LanguageEnum.Zxx,
    ]);

    return { contentLanguages };
  },
  {
    persist: true,
  },
);
