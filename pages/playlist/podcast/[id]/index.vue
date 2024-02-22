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

const onPressShuffle = async () => {
  const shuffledTracks = (await usePodcastShuffle(collectionId)).data.value;

  if (shuffledTracks) {
    setQueue(shuffledTracks);
  }
};

// TODO: Group episodes into weeks
</script>

<template>
  <div v-if="podcast">
    <div>
      <header class="mb-12 flex gap-6">
        <div class="mt-10">
          <CoverImage :src="podcast.cover" class="w-[240px] rounded-2xl" />
        </div>
        <div class="flex flex-col justify-between px-6 pt-4">
          <div>
            <PageHeading>{{ podcast.title }}</PageHeading>
            <p v-if="tracks">
              {{ t("collection.track-count", tracks.length) }}
            </p>
          </div>
          <div class="flex gap-2">
            <ButtonStyled
              intent="primary"
              icon="icon.play"
              @click="onPressPlay"
            >
              {{ t("podcast.action.play") }}
            </ButtonStyled>
            <ButtonStyled
              intent="primary"
              icon="icon.shuffle"
              @click="onPressShuffle"
            >
              {{ t("playlist.action.shuffle") }}
            </ButtonStyled>
            <CopyToClipboard
              :link="{
                name: 'playlist-podcast-id',
                params: { id: collectionId },
              }"
            >
              <ButtonStyled icon="icon.link" icon-only></ButtonStyled>
            </CopyToClipboard>
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
