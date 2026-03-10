import { createSharedComposable, useActiveElement } from "@vueuse/core";
import type {} from "@vueuse/shared";

export const privateUseShortcuts = () => {
  const macOS = computed(
    () =>
      process.client &&
      navigator &&
      navigator.userAgent &&
      navigator.userAgent.match(/Macintosh;/),
  );

  const metaSymbol = ref(" ");

  const activeElement = useActiveElement();
  const usingInput = computed(() => {
    const isUsingInput = !!(
      activeElement.value?.tagName === "INPUT" ||
      activeElement.value?.tagName === "TEXTAREA" ||
      activeElement.value?.contentEditable === "true"
    );

    if (isUsingInput) {
      return (activeElement.value as any)?.name || true;
    }

    return false;
  });

  onMounted(() => {
    metaSymbol.value = macOS.value ? "⌘" : "Ctrl";
  });

  return {
    macOS,
    metaSymbol,
    activeElement,
    usingInput,
  };
};

export const useShortcuts = createSharedComposable(privateUseShortcuts);
