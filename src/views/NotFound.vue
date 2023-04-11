<script setup lang="ts">
const props = defineProps<{
  path: string;
}>();
</script>

<template>
  <h2>{{ $t("error.page-not-found.headline") }}</h2>
  {{ $t("error.page-not-found.text", props) }}
</template>
