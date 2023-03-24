<script setup lang="ts">
import { ref, Ref } from "vue";
import { TrackModel, PlaylistModel } from "@bcc-code/bmm-sdk-fetch";
import { get, getTracks } from "@/api/playlists";
import ProtectedImage from "@/components/ProtectedImage.vue";

const props = defineProps<{
  playlistId: string;
}>();
const playlistId = Number(props.playlistId);
const playlist: Ref<PlaylistModel> = ref({});
const tracks: Ref<TrackModel[]> = ref([]);

get(playlistId)
  .then((result) => {
    playlist.value = result;
  })
  .catch(() => {});
getTracks(playlistId)
  .then((list) => {
    tracks.value = list;
  })
  .catch(() => {});
</script>

<template>
  <h2>Playlist</h2>
  <div class="flex flex-row flex-wrap" style="margin: 20px">
    <ProtectedImage
      v-if="playlist.cover"
      :src="playlist.cover"
      class="w-52 aspect-square rounded-xl"
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
