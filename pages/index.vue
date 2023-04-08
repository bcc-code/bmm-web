<script lang="ts" setup>
definePageMeta({
  toolbarTitle: "Home",
});

// Playlists
const { playlists, pending: playlistsPending } = usePlaylists();
const newestPlaylists = computed(() => playlists.value?.splice(0, 4));

// Speeches
const { tracks: speeches, pending: speechesPending } = useTracks({
  contentType2: ["speech"],
});
const newestSpeeches = computed(() => speeches.value?.splice(0, 5));

// Audiobooks
const { tracks: audiobooks, pending: audiobooksPending } = useTracks({
  contentType2: ["audiobook"],
});
const newestAudiobooks = computed(() => audiobooks.value?.splice(0, 5));
</script>

<template>
  <div>
    <section id="playlists">
      <Heading :level="3" class="mb-4">Playlists</Heading>
      <div v-if="playlistsPending" class="flex gap-6 h-64">
        <div
          v-for="i in 4"
          class="bg-slate-100 rounded-xl aspect-square h-full"
        ></div>
      </div>
      <PlaylistCarousel
        v-else-if="newestPlaylists"
        :playlists="newestPlaylists"
      />
    </section>
    <section id="speeches" class="py-8">
      <Heading :level="3" class="mb-4">Speeches</Heading>
      <TrackList :show-skeleton="speechesPending">
        <Track
          v-for="speech in newestSpeeches"
          :key="speech.id || 0"
          :track="speech"
          show-thumbnail
        />
      </TrackList>
    </section>
    <section id="podcasts" class="py-8">
      <Heading :level="3" class="mb-4">Audiobooks</Heading>
      <TrackList :show-skeleton="audiobooksPending">
        <Track
          v-for="audiobook in newestAudiobooks"
          :key="audiobook.id || 0"
          :track="audiobook"
          show-thumbnail
        />
      </TrackList>
    </section>
  </div>
</template>
