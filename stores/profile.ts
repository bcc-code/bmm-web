export const useProfileStore = defineStore(
  "profile",
  () => {
    const autoplay = ref(false);

    return {
      autoplay,
    };
  },
  {
    persist: true,
  },
);
