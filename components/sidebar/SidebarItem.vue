<script lang="ts" setup>
import { NuxtIconName } from "#app";
import { RoutesNamedLocations } from "~/.nuxt/typed-router/__routes";

withDefaults(
  defineProps<{
    type?: "page" | "playlist" | "private-playlist";
    title: string;
    link: RoutesNamedLocations;
    image?: string;
    icon?: NuxtIconName | undefined;
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
    <NuxtIcon v-if="icon" :name="icon" class="text-xl" />
    <span
      class="transition-transform group-hover:translate-x-2"
      :class="{ 'font-semibold': type == 'page', 'text-lg': type == 'page' }"
    >
      {{ title }}
    </span>
  </NuxtLink>
</template>
