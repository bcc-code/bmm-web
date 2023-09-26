<script lang="ts" setup>
const { $appInsights } = useNuxtApp();
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.playlist"));

const { id } = useRoute<"playlist-curated-id">().params;
const playlistId = Number(id);

const { data: playlist } = useCuratedPlaylist({ id: playlistId });
const { data: tracks, pending } = useCuratedPlaylistTracks({ id: playlistId });

const { setQueue, queue } = useNuxtApp().$mediaPlayer;

function shuffle() {
  if (tracks.value) {
    setQueue(tracks.value);
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
  <div v-if="playlist" class="grid grid-cols-12">
    <div class="col-span-8 col-start-3">
      <header class="mb-12 flex gap-6">
        <ProtectedImage
          v-if="playlist.cover"
          :src="playlist.cover"
          alt=""
          class="aspect-square w-[300px] rounded-2xl bg-background-2 dark:bg-background-dark-2"
        />
        <div class="flex flex-col justify-between p-6">
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
