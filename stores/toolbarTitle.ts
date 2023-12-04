import { defineStore } from "pinia";

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

  return { setReactiveToolbarTitle, toolbarTitle };
});
