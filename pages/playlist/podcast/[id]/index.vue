<script lang="ts" setup>
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.podcast"));

const { setQueue } = useNuxtApp().$mediaPlayer;
const { id } = useRoute<"playlist-podcast-id">().params;
const collectionId = Number(id);

const { data: podcast } = usePodcast({ id: collectionId });
const { data: tracks, pending: tracksPending } = usePodcastTracks({
  id: collectionId,
});

const onPressPlay = () => {
  if (tracks.value) {
    setQueue(tracks.value);
  }
};

const onPressShuffle = () => {
  const shuffledTracks = usePodcastShuffle(collectionId).data;
  if (shuffledTracks.value) {
    setQueue(shuffledTracks.value);
  }
};

// TODO: Group episodes into weeks
</script>

<template>
  <div v-if="podcast">
    <div>
      <header class="mb-12 flex gap-6">
        <ProtectedImage
          v-if="podcast.cover"
          :src="podcast.cover"
          class="aspect-square w-[240px] rounded-2xl bg-background-2 mt-10"
        />
        <div class="flex flex-col justify-between px-6 pt-4">
          <div>
            <PageHeading>{{ podcast.title }}</PageHeading>
            <p v-if="tracks">
              {{ t("collection.track-count", tracks.length) }}
            </p>
          </div>
          <div class="flex gap-2">
            <ButtonStyled intent="primary" @click.stop="onPressPlay">
              <NuxtIcon name="icon.play" class="text-2xl" />
              {{ t("podcast.action.play") }}
            </ButtonStyled>
            <ButtonStyled intent="primary" @click.stop="onPressShuffle">
              <NuxtIcon name="icon.shuffle" class="text-2xl" />
              {{ t("playlist.action.shuffle") }}
            </ButtonStyled>
            <ButtonStyled intent="secondary" style="border: 1px solid red">
              <NuxtIcon name="icon.link" />
            </ButtonStyled>
          </div>
        </div>
      </header>
      <TrackList
        :skeleton-count="10"
        :show-skeleton="tracksPending"
        :tracks="tracks"
      />
      <p style="color: red; background-color: rgb(255 0 0 / 0.1)" class="p-4">
        "Load more" functionality is not yet implemented
      </p>
    </div>
  </div>
</template>
