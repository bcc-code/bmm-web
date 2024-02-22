<script lang="ts" setup>
const { $appInsights } = useNuxtApp();
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.playlist"));

const { id } = useRoute<"playlist-curated-id">().params;
const playlistId = Number(id);

const { data: playlist } = useCuratedPlaylist({ id: playlistId });
const { data: tracks, pending } = useCuratedPlaylistTracks({ id: playlistId });

const { setQueueShuffled, setQueue } = useNuxtApp().$mediaPlayer;

const onPressPlay = () => {
  if (tracks.value) {
    setQueue(tracks.value);
  }
};
function shuffle() {
  if (tracks.value) {
    setQueueShuffled(tracks.value);
    $appInsights.event("Shuffle Playlist", { playlistId });
  }
}

onBeforeMount(() => {
  useHead({
    title: playlist.value?.title || "",
  });
});
</script>

<template>
  <div v-if="playlist">
    <div>
      <header class="mb-12 flex gap-6">
        <div class="mt-10">
          <CoverImage :src="playlist.cover" class="w-[240px] rounded-2xl" />
        </div>
        <div class="flex flex-col justify-between px-6 pt-4">
          <div>
            <PageHeading>{{ playlist.title }}</PageHeading>
            <p v-if="tracks">
              {{ t("collection.track-count", tracks.length) }}
            </p>
          </div>
          <div class="flex gap-2">
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
            <CopyToClipboard
              :link="{
                name: 'playlist-curated-id',
                params: { id: playlistId },
              }"
            >
              <ButtonStyled intent="secondary" icon="icon.link" icon-only>
              </ButtonStyled>
            </CopyToClipboard>
          </div>
        </div>
      </header>
      <TrackList
        :skeleton-count="10"
        :show-skeleton="pending"
        :tracks="tracks"
      />
    </div>
  </div>
</template>
