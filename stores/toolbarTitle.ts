export const toolbarTitleStore = defineStore("filterStore", () => {
  const toolbarTitle = ref("");

  function setReactiveToolbarTitle(translate: () => string) {
    const translation: Ref<string> = ref(translate());
    watch(
      useI18n().locale,
      () => {
        toolbarTitle.value = translate();
      },
      { immediate: true }
    );
    return translation;
  }

  return { setReactiveToolbarTitle, toolbarTitle };
});
