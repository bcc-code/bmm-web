<script setup lang="ts">
import { inject, ref, Ref } from "vue";
import { TrackModel, PlaylistModel } from "@bcc-code/bmm-sdk-fetch";
import { get, getTracks } from "@/api/playlists";
import ProtectedImage from "@/components/ProtectedImage.vue";
import filters from "@/utils/filters";
import { MediaPlaylistInjectionKey } from "@/plugins/mediaPlayer";
import auth0 from "@/auth0";

const props = defineProps<{
  playlistId: string;
}>();
const playlistId = Number(props.playlistId);
const playlist: Ref<PlaylistModel> = ref({});
const tracks: Ref<TrackModel[]> = ref([]);

const { setCurrentSong } = inject(MediaPlaylistInjectionKey)!;
// TODO: Please move this into a plugin or something the-like which configures the authorize-url function.
let token: string = "";
(async () => {
  token =
    (await (() => {
      const { getAccessTokenSilently, isAuthenticated } = auth0;
      if (!isAuthenticated.value) {
        return null;
      }
      return getAccessTokenSilently();
    })()) ?? "";
})();

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
  <h1>Playlist</h1>
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
        @click="
          setCurrentSong(
            filters.authorizedUrl(
              track.media?.[0]?.files?.[0]?.url || '',
              token
            )
          )
        "
      >
        {{ track.meta?.artist }} - <b>{{ track.meta?.title }}</b>
      </li>
    </ol>
  </div>
</template>
