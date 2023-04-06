<script lang="ts" setup>
definePageMeta({
  toolbarTitle: "Home",
});

// Playlists
const { playlists } = usePlaylists();
const newestPlaylists = computed(() => playlists.value?.splice(0, 4));

// Speeches
const { tracks: speeches } = useTracks({
  contentType2: ["speech"],
});
const newestSpeeches = computed(() => speeches.value?.splice(0, 5));

// Audiobooks
const { tracks: audiobooks } = useTracks({
  contentType2: ["audiobook"],
});
const newestAudiobooks = computed(() => audiobooks.value?.splice(0, 5));
</script>

<template>
  <section v-if="newestPlaylists" id="playlists">
    <Heading :level="3" class="mb-4">Playlists</Heading>
    <PlaylistCarousel :playlists="newestPlaylists" />
  </section>

  <section id="speeches" class="py-8">
    <Heading :level="3" class="mb-4">Speeches</Heading>
    <TrackList>
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
    <TrackList>
      <Track
        v-for="audiobook in newestAudiobooks"
        :key="audiobook.id || 0"
        :track="audiobook"
        show-thumbnail
      />
    </TrackList>
  </section>
</template>
