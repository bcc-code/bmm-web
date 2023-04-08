<script lang="ts" setup>
definePageMeta({
  toolbarTitle: "Browse",
});

const { data: playlists } = usePlaylists();
</script>

<template>
  <div>
    <Heading class="mb-6">Browse</Heading>
    <PlaylistOverview v-if="playlists" :playlists="playlists" />
  </div>
</template>
