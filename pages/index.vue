<script lang="ts" setup>
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.home"));

// Playlists
const { data: playlists, pending: playlistsPending } = useCuratedPlaylists();
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
      <div v-if="playlistsPending" class="flex h-64 gap-6">
        <div
          v-for="i in 4"
          :key="i"
          class="aspect-square h-full rounded-xl bg-background-2"
        ></div>
      </div>
      <PlaylistCarousel
        v-else-if="newestPlaylists"
        :playlists="newestPlaylists"
      />
    </ContentSection>
    <ContentSection :title="$t('nav.messages')" :link="{ name: 'messages' }">
      <TrackList
        :skeleton-count="5"
        :show-skeleton="speechesPending"
        :tracks="speeches"
      >
      </TrackList>
    </ContentSection>
    <ContentSection
      :title="$t('nav.audiobooks')"
      :link="{ name: 'audiobooks' }"
    >
      <TrackList
        :skeleton-count="5"
        :show-skeleton="audiobooksPending"
        :tracks="audiobooks"
      >
      </TrackList>
    </ContentSection>
  </div>
</template>
