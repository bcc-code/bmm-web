<script setup lang="ts">
import { inject, ref, Ref } from "vue";
import {
  TrackModel,
  PlaylistModel,
  PlaylistApi,
} from "@bcc-code/bmm-sdk-fetch";
import ProtectedImage from "@/components/ProtectedImage.vue";
import Track from "@/components/Track.vue";
import { MediaPlaylistInjectionKey } from "@/plugins/mediaPlayer";

const props = defineProps<{
  playlistId: string;
}>();
const playlistId = Number(props.playlistId);
const playlist: Ref<PlaylistModel> = ref({});
const tracks: Ref<TrackModel[]> = ref([]);

const { setCurrentSong } = inject(MediaPlaylistInjectionKey)!;

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
  <h1>{{ $t("nav.playlist") }}</h1>
  <div class="flex flex-row flex-wrap">
    <ProtectedImage
      v-if="playlist.cover"
      :src="playlist.cover"
      class="w-52 aspect-square rounded-xl"
    />
    <h3>{{ playlist.title }}</h3>
    <br />
    <ol class="list-decimal list-inside">
      <li
        v-for="track in tracks"
        :key="track.id || 0"
        @click="setCurrentSong(track.media?.[0]?.files?.[0]?.url || '')"
      >
        <Track :track="track" />
      </li>
    </ol>
  </div>
</template>
