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
  <li>
    <NuxtLink
      :to="url"
      class="py-3 px-4 rounded-lg flex"
      active-class="bg-lime-300"
    >
      {{ title }}
    </NuxtLink>
  </li>
</template>
