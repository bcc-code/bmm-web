<script lang="ts" setup>
defineProps<{
  title?: string;
}>();

defineSlots<{
  default: (props: {}) => any;
}>();
</script>

<template>
  <div class="p-3">
    <span v-if="title" class="block px-4 py-2 text-label-4">
      {{ title }}
    </span>
    <slot />
  </div>
</template>
