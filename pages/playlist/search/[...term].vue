<script lang="ts" setup>
const { term } = useRoute<"playlist-search-term">().params;
navigateTo({ name: "search-term", params: { term: term.join(" ") } });
</script>
<template>
  <div></div>
</template>
