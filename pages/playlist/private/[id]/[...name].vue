<script lang="ts" setup>
const { id } = useRoute<"playlist-contributor-id-name">().params;
navigateTo({ name: "playlist-private-id", params: { id } });
</script>
<template>
  <div></div>
</template>
