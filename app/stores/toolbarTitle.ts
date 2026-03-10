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

  function setToolbarTitleByRef(title: Ref<string>) {
    toolbarTitle.value = title.value;
    watch(title, (newTitle) => {
      toolbarTitle.value = newTitle;
    });
  }

  return {
    setReactiveToolbarTitle,
    toolbarTitle,
    setToolbarTitle,
    setToolbarTitleByRef,
  };
});
