import { PiniaPersistedStateOptions } from "@/utils/persistedState";

export const contentLanguageStore = defineStore(
  "contentLanguage",
  () => {
    const contentLanguages = ref(["nb", "en", "zxx"]);

    return { contentLanguages };
  },
  {
    persist: PiniaPersistedStateOptions,
  },
);
