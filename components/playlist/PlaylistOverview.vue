<script lang="ts" setup>
import { PlaylistModel } from "@bcc-code/bmm-sdk-fetch";

defineProps<{
  playlists: PlaylistModel[];
}>();
</script>

<template>
  <div class="grid grid-cols-4 gap-8">
    <NuxtLink
      v-for="playlist in playlists"
      :key="playlist.id"
      :to="{ name: 'playlist-curated-id', params: { id: playlist.id } }"
    >
      <ItemCard :item="playlist" />
    </NuxtLink>
  </div>
</template>
