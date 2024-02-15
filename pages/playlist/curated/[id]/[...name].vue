<script lang="ts" setup>
const { id } = useRoute<"playlist-curated-id">().params;
navigateTo({ name: "playlist-curated-id", params: { id } });
</script>
<template>
  <div></div>
</template>
