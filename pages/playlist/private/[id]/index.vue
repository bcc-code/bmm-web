<script lang="ts" setup>
import { TrackCollectionApi } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();
const { setQueue, setQueueShuffled } = useNuxtApp().$mediaPlayer;
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.playlist"));

const { id } = useRoute<"playlist-private-id">().params;
const collectionId = Number(id);
const request = usePrivatePlaylist({ id: collectionId });
const { data: collection, pending } = request;

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
    setQueueShuffled(collection.value.tracks);
  }
};
const addDropdownItems = (items: DropdownMenuItem[], track: TrackModel) => {
  console.log("testing");
  items.push({
    icon: "icon.close.small",
    text: t("track.dropdown.remove-from-playlist"),
    clickFunction: async () => {
      await new TrackCollectionApi().trackCollectionIdPut({
        id: collectionId,
        updateTrackCollectionCommand: {
          id: collectionId,
          name: collection.value?.name,
          trackReferences: tracksToTrackReferences(
            collection.value?.tracks?.filter((x) => x !== track),
          ),
        },
      });
      request.refresh();
    },
  });
};
</script>

<template>
  <div>
    <header class="mb-12 flex gap-6">
      <div
        class="mt-10 flex aspect-square w-[240px] justify-center rounded-2xl bg-background-2"
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
          <PrivatePlaylistMenu
            :playlist="collection"
            @playlist-changed="request.refresh()"
          ></PrivatePlaylistMenu>
        </div>
      </div>
    </header>
    <TrackList
      :skeleton-count="5"
      :show-skeleton="pending"
      :tracks="collection?.tracks || null"
      :add-dropdown-items="addDropdownItems"
    >
    </TrackList>
  </div>
</template>
