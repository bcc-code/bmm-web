<script lang="ts" setup>
const { data: models, pending } = useBrowseEvents();
</script>

<template>
  <DocumentList :list="models" :pending="pending"></DocumentList>
</template>
