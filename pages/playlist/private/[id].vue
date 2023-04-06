<script lang="ts" setup>
definePageMeta({
  toolbarTitle: "Playlist",
});

const { id } = useRoute().params;
const collectionId = Number(id);
const { collection } = useTrackCollection({ id: collectionId });
</script>

<template>
  <div v-if="collection">
    <header class="flex gap-6 mb-8">
      <Heading>{{ collection.name }}</Heading>
    </header>
    <TrackList class="list-decimal list-inside">
      <Track
        v-for="track in collection.tracks"
        :key="track.id || 0"
        :track="track"
        show-thumbnail
      />
    </TrackList>
  </div>
</template>
