<script lang="ts" setup>
const { t } = useI18n();

defineProps<{
  trackId: number;
}>();
const emit = defineEmits<{
  close: [];
}>();

const { data: playlists } = usePrivatePlaylists();
const selectedPlaylistId = ref(0);

const selectList = async (playlistId: number, trackId: number) => {
  selectedPlaylistId.value = playlistId;
  try {
    const promise = addTrackToPlaylist(playlistId, trackId);
    emit("close");
    await promise;
  } catch (e) {
    // TODO: Something went wrong - e.g. track is already in list ... please report it to the user.
    if (
      typeof e === "object" &&
      e !== null &&
      "response" in e &&
      e.response instanceof Response
    ) {
      const res = (await e.response.json()) as unknown;
      if (
        typeof res === "object" &&
        res !== null &&
        "code" in res &&
        res.code === 400 &&
        "errors" in res &&
        Array.isArray(res.errors) &&
        typeof res.errors[0] === "string" &&
        res.errors[0].startsWith("TrackAlreadyInTrackCollection")
      ) {
        console.error("The track is alreday in the playlist");
      } else {
        console.error(
          "some unknown error occurred when adding a track to a playlist.",
          e,
        );
      }
    } else {
      console.error(
        "some unknown error occurred when adding a track to a playlist.",
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
        class="text-label-1 flex flow-row gap-3 p-2 px-5"
        @class="
          selectedPlaylistId == collection.id
            ? ' text-label-1 bg-background-4'
            : ''
        "
        @click="selectList(collection.id, trackId)"
      >
        <NuxtIcon name="icon.category.playlist"></NuxtIcon>
        {{ collection.name }}
        <div
          v-if="selectedPlaylistId == collection.id"
          class="bg-background-4 rounded-full w-6 h-6 ml-auto"
        >
          <NuxtIcon name="icon.checkmark" class="text-on-color-1 text-2xl" />
        </div>
      </div>
    </div>
  </DialogBase>
</template>
