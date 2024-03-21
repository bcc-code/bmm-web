<script lang="ts" setup>
const { data: models, pending } = useBrowsePodcast();
setTitleOfDocumentList(models);
</script>

<template>
  <DocumentList :items="models?.items" :pending="pending" />
</template>
