<script lang="ts" setup>
const { id } = useRoute<"playlist-podcast-id">().params;
navigateTo(`/playlist/podcast/${id}/`);
</script>
<template>
  <div></div>
</template>
