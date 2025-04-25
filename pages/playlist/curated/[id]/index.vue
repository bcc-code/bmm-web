<script lang="ts" setup>
const { $appInsights } = useNuxtApp();
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.playlist"));

const { id } = useRoute<"playlist-curated-id">().params;
const playlistId = Number(id);

const { data: playlist } = useCuratedPlaylist({ id: playlistId });
const { data: tracks, pending } = useCuratedPlaylistTracks({ id: playlistId });

const { setQueueShuffled, setQueue } = useNuxtApp().$mediaPlayer;
const origin = computed(
  () => `CuratedPlaylist|${playlistId}|${playlist.value?.title}`,
);

const onPressPlay = () => {
  if (playlist.value?.tracks) {
    setQueue(playlist.value.tracks, 0, origin.value);
  }
};
function shuffle() {
  if (playlist.value?.tracks) {
    setQueueShuffled(playlist.value.tracks, origin.value);
    $appInsights.event("Shuffle Playlist", { playlistId });
  }
}

useHead({
  title: computed(() => playlist.value?.title || t("nav.playlist")),
});
</script>

<template>
  <div v-if="playlist">
    <div>
      <TrackCollectionHeader>
        <template #cover>
          <CoverImage :src="playlist.cover" class="rounded-2xl" />
        </template>
        <template #heading>
          <PageHeading>{{ playlist.title }}</PageHeading>
          <p>
            <TrackCountAndDuration
              :track-count="playlist.trackCount"
              :seconds="playlist.totalSeconds"
            />
          </p>
        </template>
        <template #actions>
          <ButtonStyled
            intent="primary"
            icon="icon.play"
            @click="onPressPlay()"
          >
            {{ t("podcast.action.play") }}
          </ButtonStyled>
          <ButtonStyled
            intent="primary"
            icon="icon.shuffle"
            @click.stop="shuffle"
            >{{ t("playlist.action.shuffle") }}</ButtonStyled
          >
          <CuratedPlaylistMenu :playlist="playlist" />
          <CopyToClipboard
            :link="{
              name: 'playlist-curated-id',
              params: { id: playlistId },
            }"
          >
            <ButtonStyled intent="secondary" icon="icon.link"> </ButtonStyled>
          </CopyToClipboard>
        </template>
      </TrackCollectionHeader>

      <TrackList
        :skeleton-count="10"
        :show-skeleton="pending"
        :tracks="tracks"
        :origin="origin"
      />
    </div>
  </div>
</template>
