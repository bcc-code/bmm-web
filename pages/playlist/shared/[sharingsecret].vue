<script lang="ts" setup>
import { SharedPlaylistApi } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();
const { setQueueShuffled } = useNuxtApp().$mediaPlayer;
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.playlist"));

const { sharingsecret } = useRoute<"playlist-shared-sharingsecret">().params;
const request = useSharedPrivatePlaylist(sharingsecret);
const { data: collection, pending } = request;

const hasBeenAdded = ref(false);
useHead({
  title: collection.value?.name || "",
});
const onAdd = async () => {
  const api = new SharedPlaylistApi();
  await api.sharedPlaylistSharingSecretFollowPost({
    sharingSecret: sharingsecret,
  });
  hasBeenAdded.value = true;
  refreshPrivatePlaylists();

  if (collection.value) {
    navigateTo({
      name: "playlist-private-id",
      params: { id: collection.value.id },
    });
  }
};
const onPressShuffle = () => {
  if (collection.value?.tracks) {
    setQueueShuffled(collection.value.tracks);
  }
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

          <div>
            {{ t("playlist.by-x", { name: collection.authorName }) }}
          </div>
          <div v-if="collection?.tracks">
            {{ t("collection.track-count", collection.tracks.length) }}
          </div>
        </div>
        <div class="flex gap-2">
          <ButtonStyled
            v-if="!hasBeenAdded"
            icon="icon.add"
            intent="primary"
            @click="onAdd()"
          >
            {{ t("playlist.action.add-to-my-playlists") }}
          </ButtonStyled>
          <ButtonStyled icon="icon.shuffle" @click="onPressShuffle()">
            {{ t("playlist.action.shuffle") }}
          </ButtonStyled>
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
