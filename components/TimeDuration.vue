<script setup lang="ts">
defineProps<{
  duration: number;
}>();
</script>
<template>
  <template v-if="!Number.isFinite(duration)">--:--</template>
  <template v-else>
    {{ (duration / 60).toFixed(0).padStart(2, "0") }}:{{
      (duration % 60).toFixed(0).padStart(2, "0")
    }}
  </template>
</template>
