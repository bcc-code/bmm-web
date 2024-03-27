<script setup lang="ts">
import type { NuxtRoute, RoutesNamesList } from "@typed-router";

const props = defineProps<{
  link: NuxtRoute<RoutesNamesList, string, boolean>;
}>();

const { t } = useI18n();

const router = useRouter();
const showToast = ref(false);

const copyToClipboard = () => {
  showToast.value = true;

  navigator.clipboard.writeText(
    `${window.location.origin}${router.resolve(props.link).href}`,
  );

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
    class="fixed inset-0 z-20 flex items-center justify-center bg-white-2 p-4 backdrop-blur-md dark:bg-black-4"
  >
    <p class="rounded-xl bg-tint px-10 py-6 text-label-1 dark:text-black-1">
      {{ t("share.link-copied-message") }}
    </p>
  </div>
  <div class="cursor-pointer" @click.stop="copyToClipboard">
    <slot />
  </div>
</template>
