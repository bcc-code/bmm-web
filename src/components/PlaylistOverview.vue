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
