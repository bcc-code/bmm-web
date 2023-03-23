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
  <div class="flex flex-row flex-wrap">
    <RouterLink
      v-for="playlist in playlists"
      :key="playlist.id || 0"
      :to="{
        name: 'CuratedPlaylistDetails',
        params: { playlistId: playlist.id },
      }"
      class="m-4 text-ellipsis overflow-hidden w-52"
    >
      <img
        :src="filters.authorizedUrl(playlist.cover || '')"
        class="w-full aspect-square rounded-xl"
      />
      <span class="whitespace-nowrap">
        {{ playlist.title }}
      </span>
    </RouterLink>
  </div>
</template>
