<script lang="ts" setup>
import { RoutesNamedLocations } from "@typed-router";

withDefaults(
  defineProps<{
    title: string;
    link?: RoutesNamedLocations;
    linkLabel?: string;
  }>(),
  {
    linkLabel: "See all",
  },
);

defineSlots<{
  default: (props: {}) => any;
}>();
</script>

<template>
  <section v-bind="$attrs">
    <header class="align-center mb-4 flex justify-between gap-4">
      <PageHeading :level="3">{{ title }}</PageHeading>
      <NuxtLink
        v-if="link"
        :to="link"
        class="bg-slate-100 hover:bg-slate-200 inline-block rounded-full px-3 py-2 text-sm leading-none"
      >
        {{ linkLabel }}
      </NuxtLink>
    </header>
    <slot />
  </section>
</template>
