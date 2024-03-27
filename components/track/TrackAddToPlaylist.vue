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
    <div class="rounded-lg bg-background-2 md:w-[500px] lg:w-[600px]">
      <div
        v-for="collection in playlists"
        :key="collection.id"
        class="flow-row flex cursor-pointer gap-3 rounded-lg p-2 px-5 text-label-1 hover:bg-label-separator"
        @click="selectList(collection.id, trackId)"
      >
        <NuxtIcon name="icon.category.playlist"></NuxtIcon>
        {{ collection.name }}
      </div>
    </div>
  </DialogBase>
</template>
