export const contentLanguageStore = defineStore(
  "contentLanguage",
  () => {
    const contentLanguages = ref(["nb", "en", "zxx"]);

    return { contentLanguages };
  },
  {
    persist: true,
  },
);
