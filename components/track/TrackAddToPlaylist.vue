<script lang="ts" setup>
import { ResponseError } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();

defineProps<{
  trackId: number;
}>();
const emit = defineEmits<{
  close: [];
}>();

const { data: playlists } = usePrivatePlaylists();

const selectList = async (playlistId: number, trackId: number) => {
  try {
    const promise = addTrackToPlaylist(playlistId, trackId);
    emit("close");
    await promise;
  } catch (e) {
    // TODO: Something went wrong - e.g. track is already in list ... please report it to the user.
    if (e instanceof ResponseError && e.response instanceof Response) {
      const res = await e.response.text();
      if (res.includes("TrackAlreadyInTrackCollection:")) {
        console.error("The track is alreday in the playlist");
      } else {
        console.error(
          "The server responded with an error when adding a track to a playlist.",
          e,
        );
      }
    } else {
      console.error(
        "Some unknown error occurred when adding a track to a playlist.",
        e,
      );
    }
  }
};
</script>

<template>
  <DialogBase
    :show="true"
    :title="t('track.dropdown.add-to-playlist')"
    @close="emit('close')"
  >
    <div class="bg-background-2 rounded-lg">
      <div
        v-for="collection in playlists"
        :key="collection.id"
        class="text-label-1 flex flow-row gap-3 p-2 px-5 hover:bg-label-separator rounded-lg"
        @class="
          selectedPlaylistId == collection.id
            ? ' text-label-1 bg-background-4'
            : ''
        "
        @click="selectList(collection.id, trackId)"
      >
        <NuxtIcon name="icon.category.playlist"></NuxtIcon>
        {{ collection.name }}
      </div>
    </div>
  </DialogBase>
</template>
