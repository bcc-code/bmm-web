<script lang="ts" setup>
definePageMeta({
  toolbarTitle: "Browse",
});

const { playlists } = usePlaylists();
</script>

<template>
  <Heading class="mb-6">Browse</Heading>
  <PlaylistOverview v-if="playlists" :playlists="playlists" />
</template>
