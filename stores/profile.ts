import type { LanguageEnum } from "@bcc-code/bmm-sdk-fetch";

export const useProfileStore = defineStore(
  "profile",
  () => {
    const autoplay = ref(false);
    const uiLanguage = ref<LanguageEnum>("en");
    const hasDisabledDownloadPromo = ref(false);

    return {
      autoplay,
      uiLanguage,
      hasDisabledDownloadPromo,
    };
  },
  {
    persist: true,
  },
);
