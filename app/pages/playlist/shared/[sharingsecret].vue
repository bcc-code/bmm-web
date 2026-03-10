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
  title: computed(() => collection.value?.name || t("nav.playlist")),
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
    <TrackCollectionHeader>
      <template #cover>
        <div
          class="flex aspect-square w-full justify-center rounded-2xl bg-background-2"
        >
          <NuxtIcon
            name="icon.category.playlist"
            class="text-5xl md:text-7xl lg:text-8xl"
          ></NuxtIcon>
        </div>
      </template>
      <template v-if="collection" #heading>
        <PageHeading>{{ collection?.name }}</PageHeading>
        <p class="type-paragraph-2 my-2 text-label-2">
          {{ t("playlist.by-x", { name: collection.authorName }) }}
        </p>
        <p v-if="collection?.tracks" class="type-paragraph-3 my-2 text-label-3">
          <TrackCountAndDuration
            :track-count="collection.trackCount"
            :seconds="collection.totalSeconds"
          ></TrackCountAndDuration>
        </p>
      </template>
      <template #actions>
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
      </template>
    </TrackCollectionHeader>

    <TrackList
      :skeleton-count="5"
      :show-skeleton="pending"
      :tracks="collection?.tracks || null"
    >
    </TrackList>
  </div>
</template>
