<script lang="ts" setup>
const { data: models, pending } = useBrowseAudiobooks();
</script>

<template>
  <DocumentList :list="models" :pending="pending"></DocumentList>
</template>
