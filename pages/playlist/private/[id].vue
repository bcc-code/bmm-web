<script lang="ts" setup>
const route = useRoute();

definePageMeta({
  toolbarTitle: "Playlist",
});
</script>

<template>
  <h1>Private playlist {{ route.params.id }}</h1>
</template>
