<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div
    class="col-span-full grid grid-cols-subgrid gap-6 rounded-lg border border-label-separator p-2"
  >
    <p class="type-subtitle-3 text-label-1">{{ title }}</p>
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      <slot />
    </div>
  </div>
</template>
