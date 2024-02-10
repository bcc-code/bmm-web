<script setup lang="ts">
import type { NuxtRoute, RoutesNamesList } from ".nuxt/typed-router";

const props = defineProps<{
  link?: NuxtRoute<RoutesNamesList, string, boolean>;
  text?: string;
}>();

const { t } = useI18n();

const router = useRouter();
const showToast = ref(false);

const copyToClipboard = () => {
  if (!props.link && !props.text) {
    return;
  }

  showToast.value = true;
  let textToCopy = props.text || "";

  if (props.link) {
    textToCopy = `${window.location.origin}${router.resolve(props.link).href}`;
  }

  navigator.clipboard.writeText(textToCopy);

  setTimeout(() => {
    showToast.value = false;
  }, 2000);
};

defineExpose({
  copyToClipboard,
});
</script>

<template>
  <div
    v-if="showToast"
    class="fixed inset-0 p-4 z-20 flex justify-center items-center bg-white-2 backdrop-blur-md dark:bg-black-4"
  >
    <p class="bg-tint text-label-1 dark:text-black-1 px-10 py-6 rounded-xl">
      {{ t("share.link-copied-message") }}
    </p>
  </div>
  <div class="cursor-pointer" @click="copyToClipboard">
    <slot />
  </div>
</template>
