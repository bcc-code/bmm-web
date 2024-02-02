<script lang="ts" setup>
const { data: models, pending } = useBrowsePodcast();
</script>

<template>
  <DocumentList :list="models" :pending="pending"></DocumentList>
</template>
