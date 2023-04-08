<script lang="ts" setup>
import { NuxtLinkProps } from "#app";

withDefaults(
  defineProps<{
    title: string;
    link?: Partial<NuxtLinkProps>;
    linkLabel?: string;
  }>(),
  {
    linkLabel: "See all",
  }
);
</script>

<template>
  <section v-bind="$attrs">
    <header class="flex gap-4 justify-between align-center mb-4">
      <Heading :level="3">{{ title }}</Heading>
      <NuxtLink
        v-if="link"
        v-bind="link"
        class="bg-slate-100 rounded-full leading-none inline-block px-3 py-2 hover:bg-slate-200 text-sm"
      >
        {{ linkLabel }}
      </NuxtLink>
    </header>
    <slot />
  </section>
</template>
