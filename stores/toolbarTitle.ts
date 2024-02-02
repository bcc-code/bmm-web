export const toolbarTitleStore = defineStore("toolbarTitle", () => {
  const toolbarTitle = ref("");

  function setReactiveToolbarTitle(translate: () => string) {
    watch(
      useI18n().locale,
      () => {
        toolbarTitle.value = translate();
      },
      { immediate: true },
    );
  }

  function setToolbarTitle(title: string) {
    toolbarTitle.value = title;
  }

  return { setReactiveToolbarTitle, toolbarTitle, setToolbarTitle };
});
