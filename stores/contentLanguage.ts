import type { LanguageEnum } from "@bcc-code/bmm-sdk-fetch";

export const useContentLanguageStore = defineStore(
  "contentLanguage",
  () => {
    const contentLanguages = ref<LanguageEnum[]>(["nb", "en", "zxx"]);

    return { contentLanguages };
  },
  {
    persist: true,
  },
);
