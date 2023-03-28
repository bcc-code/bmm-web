<!-- TODO: This component is just for testing the player until we have a proper listing of tracks. Please remove it as better possibilities of using the player are available. -->
<script setup lang="ts">
import {
  TrackModel,
  PlaylistApi,
  Configuration,
} from "@bcc-code/bmm-sdk-fetch";
import filters from "@/utils/filters";
import { MediaPlaylistInjectionKey } from "@/plugins/mediaPlayer";
import auth0 from "@/auth0";
import { Ref, ref, inject } from "vue";

const playlist: Ref<TrackModel[]> = ref([]);
const { setCurrentSong } = inject(MediaPlaylistInjectionKey)!;

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

  new PlaylistApi(
    new Configuration({
      basePath: "https://int-bmm-api.brunstad.org",
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": "nb",
      },
    })
  )
    .playlistIdTrackGet({ id: 18 })
    .then((l) => {
      playlist.value = l;
    })
    .catch(() => {});
})();
</script>
<template>
  <ul id="example-1">
    <li
      v-for="song in playlist"
      :key="song.id || 0"
      @click="
        setCurrentSong(
          filters.authorizedUrl(song.media?.[0]?.files?.[0]?.url || '', token)
        )
      "
    >
      {{ song.title }} {{ song.id }}
      {{}}
    </li>
  </ul>
</template>
