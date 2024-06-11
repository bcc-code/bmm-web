<script setup lang="ts">
import type { NuxtRoute, RoutesNamesList } from "@typed-router";

const props = defineProps<{
  link: NuxtRoute<RoutesNamesList, string, boolean>;
}>();

const { t } = useI18n();
const runtimeConfig = useRuntimeConfig();
const isElectron = runtimeConfig.public.systemName === "Electron";

const router = useRouter();
const showToast = ref(false);

const copyToClipboard = () => {
  showToast.value = true;

  const domain = isElectron
    ? `https://${config.websiteDomain}`
    : window.location.origin;

  navigator.clipboard.writeText(
    `${domain}${router.resolve(props.link).href.replace("/./", "/")}`, // not sure why Electron adds /. at the beginning
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
