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
    <span v-if="title" class="mb-0.5 block px-4 py-1 text-[15px] text-label-3">
      {{ title }}
    </span>
    <slot />
  </div>
</template>
