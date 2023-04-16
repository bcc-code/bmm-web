<script setup lang="ts">
import { ref, Ref } from "vue";
import {
  TrackModel,
  PlaylistModel,
  PlaylistApi,
} from "@bcc-code/bmm-sdk-fetch";
import ProtectedImage from "@/components/ProtectedImage.vue";
import Track from "@/components/Track.vue";

const props = defineProps<{
  playlistId: string;
}>();
const playlistId = Number(props.playlistId);
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
</script>

<template>
  <h1>Playlist</h1>
  <div class="flex flex-row flex-wrap">
    <ProtectedImage
      v-if="playlist.cover"
      :src="playlist.cover"
      class="w-52 aspect-square rounded-xl"
    />
    <h3>{{ playlist.title }}</h3>
    <br />
    <!-- <ol class="list-decimal list-inside">
      <li v-for="track in tracks" :key="track.id || 0" class="flex">
        {{ track.meta?.title }} - <b>{{ track.meta?.artist }}</b>
      </li>
    </ol> -->
    <ol class="list-decimal list-inside">
      <li v-for="track in tracks" :key="track.id || 0" class="flex">
        <Track :track="track" />
      </li>
    </ol>
  </div>
</template>
