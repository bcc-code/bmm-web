<script lang="ts" setup>
definePageMeta({
  toolbarTitle: "Playlist",
});

const { id } = useRoute().params;
const collectionId = Number(id);
const { data: collection, pending } = useTrackCollection({ id: collectionId });

useHead({
  title: collection.value?.name,
});
</script>

<template>
  <div>
    <header class="flex gap-6 mb-8">
      <Heading v-if="collection">{{ collection?.name }}</Heading>
      <div v-else class="h-12 bg-slate-100 w-1/3 rounded-lg mb-6"></div>
    </header>
    <TrackList :skeleton-count="5" :show-skeleton="pending">
      <Track
        v-for="track in collection?.tracks"
        :key="track.id || 0"
        :track="track"
        show-thumbnail
      />
    </TrackList>
  </div>
</template>
