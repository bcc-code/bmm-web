<script lang="ts" setup>
const { data: models, pending } = useFeaturedPlaylists();
</script>

<template>
  <DocumentList :list="models" :pending="pending"></DocumentList>
</template>
