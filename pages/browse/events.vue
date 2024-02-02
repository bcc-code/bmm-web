<script lang="ts" setup>
const { data: models, pending } = useBrowseEvents();
setTitleOfDocumentList(models);
</script>

<template>
  <DocumentList :items="models?.items" :pending="pending"></DocumentList>
</template>
