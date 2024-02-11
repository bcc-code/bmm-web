<script setup lang="ts">
const props = defineProps<{
  duration: number;
}>();

const timeAsText = computed(() => formatTime(props.duration));
</script>
<template>
  {{ timeAsText }}
</template>
