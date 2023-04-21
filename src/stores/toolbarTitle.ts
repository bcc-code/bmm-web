import { Ref, ref, watch } from "vue";
import { defineStore } from "pinia";
import i18n from "../plugins/i18n";

export default defineStore("filterStore", () => {
  const toolbarTitle = ref("");

  function setReactiveToolbarTitle(translate: () => string) {
    const translation: Ref<string> = ref(translate());
    watch(
      i18n.global.locale,
      () => {
        toolbarTitle.value = translate();
      },
      { immediate: true }
    );
    return translation;
  }

  return { setReactiveToolbarTitle, toolbarTitle };
});
