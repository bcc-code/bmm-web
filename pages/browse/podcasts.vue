<script lang="ts" setup>
const { data: models, pending } = useBrowsePodcast();
setTitleOfDocumentList(models);
</script>

<template>
  <EndlessDocumentList
    :items="models?.items"
    :pending="pending"
  ></EndlessDocumentList>
</template>
