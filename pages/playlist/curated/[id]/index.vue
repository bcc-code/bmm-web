<script lang="ts" setup>
const { $appInsights } = useNuxtApp();
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.playlist"));

const { id } = useRoute<"playlist-curated-id">().params;
const playlistId = Number(id);

const { data: playlist } = useCuratedPlaylist({ id: playlistId });
const { data: tracks, pending } = useCuratedPlaylistTracks({ id: playlistId });

const { setQueue, queue, currentTrack } = useNuxtApp().$mediaPlayer;

watch(currentTrack, (oldTrack, newTrack) => {
  if (!oldTrack) return;
  if (oldTrack?.language !== newTrack?.language) {
    const { data: newLangTracks } = useCuratedPlaylistTracks({
      id: playlistId,
      locale: newTrack?.language,
    });

    setQueue(newLangTracks.value || []);
  }
});

function shuffle() {
  if (tracks.value) {
    // set the first track to a random number based on the current playlist length
    const trackIndex = Math.floor(Math.random() * tracks.value.length);
    setQueue(tracks.value, trackIndex);
    queue.value.shuffle();

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
        <ProtectedImage
          v-if="playlist.cover"
          :src="playlist.cover"
          class="aspect-square w-[240px] rounded-2xl bg-background-2 mt-10"
        />
        <div class="flex flex-col justify-between px-6 pt-4">
          <div>
            <PageHeading>{{ playlist.title }}</PageHeading>
            <p v-if="tracks">
              {{ t("collection.track-count", tracks.length) }}
            </p>
          </div>
          <div class="flex gap-2">
            <ButtonStyled intent="primary" @click.stop="shuffle">{{
              t("playlist.action.shuffle")
            }}</ButtonStyled>

            <CopyToClipboard
              :link="{
                name: 'playlist-curated-id',
                params: { id: playlistId },
              }"
            >
              <ButtonStyled intent="secondary" class="h-full aspect-square">
                <NuxtIcon name="icon.link" />
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
