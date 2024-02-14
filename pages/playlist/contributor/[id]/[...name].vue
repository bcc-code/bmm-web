<script lang="ts" setup>
const { id } = useRoute<"playlist-contributor-id">().params;
navigateTo(`/playlist/contributor/${id}/`);
</script>
<template>
  <div></div>
</template>
