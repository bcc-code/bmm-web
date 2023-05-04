<script lang="ts" setup>
defineProps<{
  title?: string;
}>();
</script>

<template>
  <div class="p-3">
    <span v-if="title" class="text-label-4 block px-4 py-2">
      {{ title }}
    </span>
    <slot />
  </div>
</template>
