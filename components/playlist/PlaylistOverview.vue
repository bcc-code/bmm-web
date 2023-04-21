<script lang="ts" setup>
import { PlaylistModel } from "@bcc-code/bmm-sdk-fetch";
import PlaylistCard from "./PlaylistCard.vue";

defineProps<{
  playlists: PlaylistModel[];
}>();
</script>

<template>
  <div class="grid grid-cols-4 gap-8">
    <NuxtLink
      v-for="playlist in playlists"
      :key="playlist.id || 0"
      :to="`/playlist/curated/${playlist.id}`"
    >
      <PlaylistCard :playlist="playlist" />
    </NuxtLink>
  </div>
</template>
