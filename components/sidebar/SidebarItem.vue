<script lang="ts" setup>
import { RoutesNamedLocations } from "~/.nuxt/typed-router/__routes";

withDefaults(
  defineProps<{
    type?: "page" | "playlist" | "private-playlist";
    title: string;
    link: RoutesNamedLocations;
    image?: string;
  }>(),
  {
    type: "page",
    image: "",
  }
);
</script>

<template>
  <NuxtLink
    :to="link"
    active-class="bg-tint"
    class="group flex gap-2 rounded-xl px-4 py-2"
  >
    <ProtectedImage
      v-if="image"
      :src="image"
      class="aspect-square h-full rounded bg-background-2"
    />
    <span class="transition-transform group-hover:translate-x-2">
      {{ title }}
    </span>
  </NuxtLink>
</template>
