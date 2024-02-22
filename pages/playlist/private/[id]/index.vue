<script lang="ts" setup>
const { t } = useI18n();
const { setQueue, setQueueShuffled } = useNuxtApp().$mediaPlayer;
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.playlist"));

const { id } = useRoute<"playlist-private-id">().params;
const collectionId = Number(id);
const { data: collection, pending } = usePrivatePlaylist({ id: collectionId });

useHead({
  title: collection.value?.name || "",
});
const onPressPlay = () => {
  if (collection.value?.tracks) {
    setQueue(collection.value.tracks);
  }
};
const onPressShuffle = () => {
  if (collection.value?.tracks) {
    setQueueShuffled(collection.value?.tracks);
  }
};
</script>

<template>
  <div>
    <header class="mb-12 flex gap-6">
      <div
        class="aspect-square w-[240px] rounded-2xl bg-background-2 mt-10 flex justify-center"
      >
        <NuxtIcon name="icon.category.playlist" class="text-8xl"></NuxtIcon>
      </div>
      <div v-if="collection" class="flex flex-col justify-between px-6 pt-4">
        <div>
          <PageHeading>{{ collection?.name }}</PageHeading>
          <div v-if="collection?.tracks">
            {{ t("collection.track-count", collection.tracks.length) }}
          </div>
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
            @click="onPressShuffle()"
          >
            {{ t("playlist.action.shuffle") }}
          </ButtonStyled>
          <PrivatePlaylistMenu :playlist="collection"></PrivatePlaylistMenu>
        </div>
      </div>
    </header>
    <TrackList
      :skeleton-count="5"
      :show-skeleton="pending"
      :tracks="collection?.tracks || null"
    >
    </TrackList>
  </div>
</template>
