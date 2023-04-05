<script lang="ts" setup>
import {
  PlaylistApi,
  PlaylistModel,
  TrackModel,
} from "@bcc-code/bmm-sdk-fetch";

const { id } = useRoute().params;

const playlistId = Number(id);
const playlist: Ref<PlaylistModel> = ref({});
const tracks: Ref<TrackModel[]> = ref([]);

new PlaylistApi()
  .playlistIdGet({ id: playlistId })
  .then((result) => {
    playlist.value = result;
  })
  .catch(() => {});

new PlaylistApi()
  .playlistIdTrackGet({ id: playlistId })
  .then((list) => {
    tracks.value = list;
  })
  .catch(() => {});

definePageMeta({
  toolbarTitle: "Playlist",
});
</script>

<template>
  <h1>Curated Playlist</h1>
  <div class="flex flex-row flex-wrap">
    <ProtectedImage
      v-if="playlist.cover"
      :src="playlist.cover"
      alt=""
      class="w-52 aspect-square rounded-xl"
    />
    <h3>{{ playlist.title }}</h3>
    <br />
    <ol class="list-decimal list-inside">
      <li v-for="track in tracks" :key="track.id || 0" class="flex">
        {{ track.meta?.title }} - <b>{{ track.meta?.artist }}</b>
      </li>
    </ol>
  </div>
</template>
