export const useProfileStore = defineStore(
  "profile",
  () => {
    const autoplay = ref(false);
    const uiLanguage = ref("en");
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
