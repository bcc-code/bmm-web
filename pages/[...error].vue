<script setup lang="ts">
const { params } = useRoute<"error">();
</script>

<template>
  <div>
    <h2>{{ $t("error.page-not-found.headline") }}</h2>
    {{ $t("error.page-not-found.text", params) }}
  </div>
</template>
