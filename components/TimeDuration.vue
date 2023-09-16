<script setup lang="ts">
const props = defineProps<{
  duration: number;
}>();

const timeAsText = computed(() =>
  !Number.isFinite(props.duration)
    ? "--:--"
    : `${`${Math.floor(props.duration / 60)}`.padStart(2, "0")}:${`${Math.floor(
        props.duration % 60
      )}`.padStart(2, "0")}`
);
</script>
<template>
  {{ timeAsText }}
</template>
