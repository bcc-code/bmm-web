<script setup lang="ts">
import { inject, ref, Ref, watch } from "vue";
import {
  TrackModel,
  PlaylistModel,
  PlaylistApi,
} from "@bcc-code/bmm-sdk-fetch";
import ProtectedImage from "@/components/ProtectedImage.vue";
import { MediaPlaylistInjectionKey } from "@/plugins/mediaPlayer";

const props = defineProps<{
  playlistId: string;
}>();
const playlist: Ref<PlaylistModel> = ref({});
const tracks: Ref<TrackModel[]> = ref([]);

const { setCurrentSong } = inject(MediaPlaylistInjectionKey)!;

watch(
  () => props.playlistId,
  () => {
    const playlistId = Number(props.playlistId);
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
  },
  { immediate: true }
);
</script>

<template>
  <div>
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
          class="flex"
          @click="setCurrentSong(track.media?.[0]?.files?.[0]?.url || '')"
        >
          {{ track.meta?.title }} - <b>{{ track.meta?.artist }}</b>
        </li>
      </ol>
    </div>
  </div>
</template>
