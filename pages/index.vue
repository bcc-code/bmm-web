<script lang="ts" setup>
definePageMeta({
  toolbarTitle: "Home",
});

const { playlists } = usePlaylists();
const { tracks: speeches } = useTracks({
  contentType2: ["speech"],
});
const { tracks: podcasts } = useTracks({
  contentType2: ["audiobook"],
});
</script>

<template>
  <section id="speeches" class="py-8">
    <Heading :level="3" class="mb-4">Speeches</Heading>
    <TrackList>
      <Track
        v-for="speech in speeches"
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
        v-for="podcast in podcasts"
        :key="podcast.id || 0"
        :track="podcast"
        show-thumbnail
      />
    </TrackList>
  </section>
</template>
