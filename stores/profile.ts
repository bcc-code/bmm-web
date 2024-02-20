export const useProfileStore = defineStore(
  "profile",
  () => {
    const autoplay = ref(false);
    const uiLanguage = ref("en");

    return {
      autoplay,
      uiLanguage,
    };
  },
  {
    persist: true,
  },
);
