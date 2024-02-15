<script lang="ts" setup>
const { id } = useRoute<"playlist-private-id">().params;
navigateTo({ name: "playlist-private-id", params: { id } });
</script>
<template>
  <div></div>
</template>
