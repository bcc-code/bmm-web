<script setup lang="ts">
import filters from "@/utils/filters";
import { ref, Ref } from "vue";
import {
  PlaylistApi,
  Configuration,
  TrackModel,
  PlaylistModel,
} from "@bcc-code/bmm-sdk-fetch";

const props = defineProps<{
  playlistId: number;
}>();
const playlist: Ref<PlaylistModel> = ref({});
const tracks: Ref<TrackModel[]> = ref([]);

const api = new PlaylistApi(
  new Configuration({
    basePath: import.meta.env.VITE_API_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Accept-Language": "nb,en,zxx",
    },
  })
);

api
  .playlistIdGet({ id: props.playlistId })
  .then((result) => {
    playlist.value = result;
  })
  .catch(() => {});
api
  .playlistIdTrackGet({ id: props.playlistId })
  .then((list) => {
    tracks.value = list;
  })
  .catch(() => {});
</script>

<template>
  <h2>Playlist</h2>
  <div style="margin: 20px">
    <img
      :src="filters.authorizedUrl(playlist.cover || '')"
      width="240"
      height="240"
    />
    <h3>{{ playlist.title }}</h3>
    <br />
    <ul v-for="track in tracks" :key="track.id || 0">
      <li>
        {{ track.meta?.artist }} - <b>{{ track.meta?.title }}</b>
      </li>
    </ul>
  </div>
</template>
