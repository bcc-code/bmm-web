<script lang="ts" setup>
const props = defineProps<{
  title?: string;
}>();
</script>

<template>
  <div>
    <span v-if="title" class="text-slate-400 block px-4 py-2">
      {{ title }}
    </span>
    <slot />
  </div>
</template>
