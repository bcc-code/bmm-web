<script lang="ts" setup>
import { TrackCollectionApi } from "@bcc-code/bmm-sdk-fetch";
import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();
const { setQueue, setQueueShuffled } = useNuxtApp().$mediaPlayer;
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.playlist"));

const { id } = useRoute<"playlist-private-id">().params;
const collectionId = Number(id);
const request = usePrivatePlaylist({ id: collectionId });
const { data: collection, pending } = request;

useHead({
  title: computed(() => collection.value?.name || t("nav.playlist")),
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
const extractSecret = (link: string) => {
  const parts = link.split("/");
  return parts[parts.length - 1] || "";
};
const addDropdownItems = (items: DropdownMenuItem[], track: TrackModel) => {
  if (!collection.value || !collection.value.canEdit) return;
  items.push({
    icon: "icon.close.small",
    text: t("track.dropdown.remove-from-playlist"),
    clickFunction: async () => {
      if (!collection.value) return;
      await new TrackCollectionApi().trackCollectionIdPut({
        id: collectionId,
        updateTrackCollectionCommand: {
          id: collectionId,
          name: collection.value.name || "",
          trackReferences: tracksToTrackReferences(
            collection.value?.tracks?.filter((x) => x !== track),
          ),
        },
      });
      request.refresh();
    },
  });
};

const handleReorder = (tracks: TrackModel[]) => {
  if (!collection.value || !collection.value.canEdit) {
    return;
  }
  new TrackCollectionApi().trackCollectionIdPut({
    id: collectionId,
    updateTrackCollectionCommand: {
      id: collectionId,
      name: collection.value.name || "",
      trackReferences: tracksToTrackReferences(tracks),
    },
  });
  collection.value.tracks = tracks;
};
</script>

<template>
  <div>
    <TrackCollectionHeader>
      <template #cover>
        <div
          class="flex aspect-square w-full justify-center rounded-2xl bg-background-2"
        >
          <NuxtIcon
            :name="
              collection?.useLikeIcon
                ? 'icon.category.favorites'
                : 'icon.category.playlist'
            "
            class="text-5xl md:text-7xl lg:text-8xl"
          />
        </div>
      </template>
      <template v-if="collection" #heading>
        <PageHeading>{{ collection?.name }}</PageHeading>

        <div v-if="collection.authorName && !collection.canEdit">
          {{ t("playlist.by-x", { name: collection.authorName }) }}
        </div>
        <div v-if="collection?.tracks">
          <TrackCountAndDuration
            :track-count="collection.trackCount"
            :seconds="collection.totalSeconds"
          ></TrackCountAndDuration>
        </div>
      </template>
      <template v-if="collection" #actions>
        <ButtonStyled intent="primary" icon="icon.play" @click="onPressPlay()">
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
        />
        <CopyToClipboard
          v-if="collection.shareLink && collection.canEdit"
          :link="{
            name: 'playlist-shared-sharingsecret',
            params: { sharingsecret: extractSecret(collection.shareLink) },
          }"
        >
          <ButtonStyled icon="icon.link"></ButtonStyled>
        </CopyToClipboard>
      </template>
    </TrackCollectionHeader>

    <TrackList
      :key="`tracklist:can-edit:${collection?.canEdit}`"
      :skeleton-count="5"
      :show-skeleton="pending"
      :tracks="collection?.tracks || null"
      :add-dropdown-items="addDropdownItems"
      :reorder="collection?.canEdit"
      @reorder="handleReorder"
    />
  </div>
</template>
