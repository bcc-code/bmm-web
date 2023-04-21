<script setup lang="ts">
const { params } = useRoute();
</script>

<template>
  <div>
    <h2>{{ $t("error.page-not-found.headline") }}</h2>
    {{ $t("error.page-not-found.text", params) }}
  </div>
</template>
