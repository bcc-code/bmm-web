<script setup lang="ts">
import type { NuxtRoute, RoutesNamesList } from "@typed-router";
import { toast } from "vue-sonner";

const props = defineProps<{
  link: NuxtRoute<RoutesNamesList, string, boolean>;
}>();

const { t } = useI18n();
const runtimeConfig = useRuntimeConfig();
const isElectron = runtimeConfig.public.systemName === "Electron";

const router = useRouter();

const copyToClipboard = () => {
  const domain = isElectron
    ? `https://${config.websiteDomain}`
    : window.location.origin;

  navigator.clipboard
    .writeText(
      `${domain}${router.resolve(props.link).href.replace("/./", "/")}`, // not sure why Electron adds /. at the beginning
    )
    .then(() => {
      toast.success(t("share.link-copied-message"));
    })
    .catch(() => {
      toast.error("Could not copy link");
    });
};

defineExpose({
  copyToClipboard,
});
</script>

<template>
  <div class="cursor-pointer" @click.stop="copyToClipboard">
    <slot />
  </div>
</template>
