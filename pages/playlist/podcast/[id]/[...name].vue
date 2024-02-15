<script lang="ts" setup>
const { id } = useRoute<"playlist-podcast-id">().params;
navigateTo({ name: "playlist-podcast-id", params: { id } });
</script>
<template>
  <div></div>
</template>
