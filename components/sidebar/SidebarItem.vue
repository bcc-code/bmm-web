<script lang="ts" setup>
withDefaults(
  defineProps<{
    type?: "page" | "playlist" | "private-playlist";
    title: string;
    url: string;
  }>(),
  {
    type: "page",
  }
);
</script>

<template>
  <NuxtLink
    :to="url"
    active-class="bg-lime-400"
    class="py-2 px-4 rounded-xl flex"
  >
    {{ title }}
  </NuxtLink>
</template>
