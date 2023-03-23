<script setup lang="ts">
import filters from "@/utils/filters";
import { ref, Ref } from "vue";
import {
  Configuration,
  PlaylistApi,
  PlaylistModel,
} from "@bcc-code/bmm-sdk-fetch";
import { useAuth0 } from "@auth0/auth0-vue";

const playlists: Ref<PlaylistModel[]> = ref([]);
const { getAccessTokenSilently } = useAuth0();
getAccessTokenSilently()
  .then((token) =>
    new PlaylistApi(
      new Configuration({
        basePath: import.meta.env.VITE_API_URL,
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": "nb,en,zxx",
        },
      })
    ).playlistGet()
  )
  .then((list) => {
    playlists.value = list;
  })
  .catch(() => {});
</script>

<template>
  <div id="example-1" class="covers">
    <div v-for="playlist in playlists" :key="playlist.id || 0" class="cover">
      <img
        :src="filters.authorizedUrl(playlist.cover || '')"
        width="214"
        height="214"
      />
      <span class="title">
        {{ playlist.title }}
      </span>
    </div>
  </div>
</template>
