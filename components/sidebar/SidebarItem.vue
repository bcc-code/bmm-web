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
    active-class="bg-lime-400"
    class="py-2 px-4 rounded-xl group flex gap-2"
  >
    <ProtectedImage
      v-if="image"
      :src="image"
      class="h-full aspect-square rounded bg-slate-200"
    />
    <span class="group-hover:translate-x-2 transition-transform">
      {{ title }}
    </span>
  </NuxtLink>
</template>
