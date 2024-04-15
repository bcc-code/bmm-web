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
</script>

<template>
  <div>
    <header class="mb-12 flex gap-6">
      <div class="mt-10 w-[240px] shrink-0">
        <div
          class="flex aspect-square w-[240px] shrink-0 justify-center rounded-2xl bg-background-2"
        >
          <NuxtIcon name="icon.category.playlist" class="text-8xl"></NuxtIcon>
        </div>
      </div>
      <div v-if="collection" class="flex flex-col justify-between px-6 pt-4">
        <div>
          <PageHeading>{{ collection?.name }}</PageHeading>

          <div v-if="collection.authorName && !collection.canEdit">
            {{ t("playlist.by-x", { name: collection.authorName }) }}
          </div>
          <div v-if="collection?.tracks">
            {{ t("collection.track-count", collection.tracks.length) }}
          </div>
        </div>
        <div class="mt-2 flex gap-2">
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
