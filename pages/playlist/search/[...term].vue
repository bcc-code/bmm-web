<script lang="ts" setup>
const { term } = useRoute<"playlist-search-term">().params;
navigateTo(`/search?term=${term}`);
</script>
<template>
  <div></div>
</template>
