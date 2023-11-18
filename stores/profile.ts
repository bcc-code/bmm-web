import { PiniaPersistedStateOptions } from "@/utils/persistedState";

export const useProfileStore = defineStore(
  "profile",
  () => {
    const autoplay = ref(false);

    return {
      autoplay,
    };
  },
  {
    persist: PiniaPersistedStateOptions,
  },
);
