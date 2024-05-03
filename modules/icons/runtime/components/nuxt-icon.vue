<script setup lang="ts">
import type { NuxtIconName } from "#build/nuxt-icons";
import { ref, watchEffect } from "#imports";

const props = withDefaults(
  defineProps<{
    name: NuxtIconName;
  }>(),
  {},
);

const icon = ref<string | Record<string, any>>("");

async function getIcon() {
  const iconsImport = import.meta.glob("assets/icons/**/**.svg", {
    query: "?raw",
    import: "default",
    eager: false,
  });
  const rawIcon = await iconsImport[`/assets/icons/${props.name}.svg`]?.();
  if (rawIcon) {
    icon.value = rawIcon;
  }
}

getIcon().catch((e) => {
  // eslint-disable-next-line no-console
  console.warn(
    `[nuxt-icons] Failed. Does icon '${props.name}' exist in 'assets/icons'? Error was:`,
    e,
  );
});

watchEffect(getIcon);
</script>

<template>
  <span class="nuxt-icon" v-html="icon" />
</template>

<style>
.nuxt-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 1em;
  min-height: 1em;
}
.nuxt-icon svg {
  width: 1em;
  height: 1em;
  vertical-align: middle;
}
</style>
