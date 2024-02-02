<script lang="ts" setup>
const { data: models, pending } = useBrowseMusic();
</script>

<template>
  <DocumentList :list="models" :pending="pending"></DocumentList>
</template>
