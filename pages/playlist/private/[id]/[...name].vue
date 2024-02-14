<script lang="ts" setup>
const { id } = useRoute<"playlist-private-id">().params;
navigateTo(`/playlist/private/${id}/`);
</script>
<template>
  <div></div>
</template>
