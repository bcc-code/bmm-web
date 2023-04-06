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
    active-class="bg-lime-300"
    class="py-3 px-4 rounded-lg flex hover:bg-slate-200"
  >
    {{ title }}
  </NuxtLink>
</template>
