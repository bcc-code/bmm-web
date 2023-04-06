<script lang="ts" setup>
definePageMeta({
  toolbarTitle: "Home",
});

const { playlists, error } = usePlaylists();

onMounted(() => {
  if (error.value) {
    console.error(error.value);
    throw createError(error.value);
  }
});
</script>

<template>
  <div>
    <PlaylistOverview v-if="playlists" :playlists="playlists" />
  </div>
</template>
