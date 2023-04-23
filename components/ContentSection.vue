<script lang="ts" setup>
import { RoutesNamedLocations } from "~/.nuxt/typed-router/__routes";

withDefaults(
  defineProps<{
    title: string;
    link?: RoutesNamedLocations;
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
      <PageHeading :level="3">{{ title }}</PageHeading>
      <NuxtLink
        v-if="link"
        :to="link"
        class="bg-slate-100 rounded-full leading-none inline-block px-3 py-2 hover:bg-slate-200 text-sm"
      >
        {{ linkLabel }}
      </NuxtLink>
    </header>
    <slot />
  </section>
</template>
