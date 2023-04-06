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
    <header class="flex gap-6 mb-8">
      <ProtectedImage
        v-if="playlist.cover"
        :src="playlist.cover"
        :alt="playlist.title || ''"
        class="aspect-square rounded-xl bg-slate-100 w-[300px]"
      />
      <h1 class="font-bold text-4xl">{{ playlist.title }}</h1>
    </header>
    <ol class="list-decimal list-inside">
      <Track v-for="track in tracks" :key="track.id || 0" :track="track" />
    </ol>
  </div>
</template>
