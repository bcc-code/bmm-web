<script lang="ts" setup>
definePageMeta({
  toolbarTitle: "Playlist",
});

const { id } = useRoute().params;
const playlistId = Number(id);

const { playlist } = usePlaylist({ id: playlistId });
const { tracks } = usePlaylistTracks({ id: playlistId });
</script>

<template>
  <div v-if="playlist" class="">
    <header class="flex gap-6 mb-12">
      <ProtectedImage
        v-if="playlist.cover"
        :src="playlist.cover"
        :alt="playlist.title || ''"
        class="aspect-square rounded-2xl bg-slate-100 w-[300px]"
      />
      <div class="p-6">
        <Heading>{{ playlist.title }}</Heading>
      </div>
    </header>
    <TrackList>
      <Track v-for="track in tracks" :key="track.id || 0" :track="track" />
    </TrackList>
  </div>
</template>
