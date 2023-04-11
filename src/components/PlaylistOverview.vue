<script setup lang="ts">
import { ref, Ref } from "vue";
import { PlaylistApi, PlaylistModel } from "@bcc-code/bmm-sdk-fetch";

import ProtectedImage from "./ProtectedImage.vue";

const playlists: Ref<PlaylistModel[]> = ref([]);

new PlaylistApi()
  .playlistGet()
  .then((r) => {
    playlists.value = r;
  })
  .catch(() => null /* TODO: implement error-handling */);
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
      <ProtectedImage
        v-if="playlist.cover"
        :src="playlist.cover"
        class="w-full aspect-square rounded-xl"
      />
      <span class="whitespace-nowrap">
        {{ playlist.title }}
      </span>
    </RouterLink>
  </div>
</template>
