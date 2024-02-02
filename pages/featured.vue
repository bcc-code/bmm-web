<script lang="ts" setup>
const { data: models, pending } = useFeaturedPlaylists();
setTitleOfDocumentList(models);
</script>

<template>
  <DocumentList :items="models?.items" :pending="pending"></DocumentList>
</template>
