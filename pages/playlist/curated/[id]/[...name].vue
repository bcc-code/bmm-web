<script lang="ts" setup>
const { id } = useRoute<"playlist-curated-id">().params;
navigateTo(`/playlist/curated/${id}/`);
</script>
<template>
  <div></div>
</template>
