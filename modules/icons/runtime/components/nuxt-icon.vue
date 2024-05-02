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
  try {
    const iconsImport = import.meta.glob("assets/icons/**/**.svg", {
      query: "?raw",
      import: "default",
      eager: false,
    });
    const rawIcon = await iconsImport[`/assets/icons/${props.name}.svg`]?.();

    if (rawIcon) {
      icon.value = rawIcon;
    }
  } catch {
    throw new Error(
      `[nuxt-icons] Icon '${props.name}' doesn't exist in 'assets/icons'`,
    );
  }
}

getIcon();

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
