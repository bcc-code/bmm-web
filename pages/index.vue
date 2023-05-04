<script lang="ts" setup>
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.home"));

// Playlists
const { data: playlists, pending: playlistsPending } = usePlaylists();
const newestPlaylists = computed(() => playlists.value?.splice(0, 4) || null);

// Speeches
const { data: speeches, pending: speechesPending } = useTracks({
  contentType2: ["speech"],
  size: 5,
});

// Audiobooks
const { data: audiobooks, pending: audiobooksPending } = useTracks({
  contentType2: ["audiobook"],
  size: 5,
});
</script>

<template>
  <div class="flex flex-col gap-16">
    <ContentSection title="Playlists">
      <div v-if="playlistsPending" class="flex gap-6 h-64">
        <div
          v-for="i in 4"
          :key="i"
          class="bg-background-2 rounded-xl aspect-square h-full"
        ></div>
      </div>
      <PlaylistCarousel
        v-else-if="newestPlaylists"
        :playlists="newestPlaylists"
      />
    </ContentSection>
    <ContentSection title="Speeches" :link="{ name: 'messages' }">
      <TrackList
        :skeleton-count="5"
        :show-skeleton="speechesPending"
        :tracks="speeches"
      >
      </TrackList>
    </ContentSection>
    <ContentSection title="Audiobooks" :link="{ name: 'audiobooks' }">
      <TrackList
        :skeleton-count="5"
        :show-skeleton="audiobooksPending"
        :tracks="audiobooks"
      >
      </TrackList>
    </ContentSection>
  </div>
</template>
