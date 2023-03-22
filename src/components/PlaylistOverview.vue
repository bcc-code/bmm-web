<script setup lang="ts">
import filters from "@/utils/filters";
import { ref, Ref } from "vue";
import {
  PlaylistApi,
  PlaylistModel,
  Configuration,
} from "@bcc-code/bmm-sdk-fetch";

const playlists: Ref<PlaylistModel[]> = ref([]);

new PlaylistApi(
  new Configuration({
    basePath: import.meta.env.VITE_API_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Accept-Language": "nb,en,zxx",
    },
  })
)
  .playlistGet()
  .then((list) => {
    playlists.value = list;
  })
  .catch(() => {});
</script>

<template>
  <div id="example-1" class="covers">
    <RouterLink
      v-for="playlist in playlists"
      :key="playlist.id || 0"
      :to="{
        name: 'CuratedPlaylistDetails',
        params: { playlistId: playlist.id },
      }"
      class="cover"
    >
      <img
        :src="filters.authorizedUrl(playlist.cover || '')"
        width="214"
        height="214"
      />
      <span class="title">
        {{ playlist.title }}
      </span>
    </RouterLink>
  </div>
</template>
