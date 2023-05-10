<script lang="ts" setup>
import { PlaylistModel } from "@bcc-code/bmm-sdk-fetch";

defineProps<{
  playlists: PlaylistModel[];
}>();
</script>

<template>
  <div class="flex h-64 w-full gap-6 overflow-x-auto">
    <NuxtLink
      v-for="playlist in playlists"
      :key="playlist.id || 0"
      :to="{ name: 'playlist-curated-id', params: { id: playlist.id || 0 } }"
      class="aspect-square h-full"
    >
      <ProtectedImage
        :src="playlist.cover || ''"
        alt=""
        class="h-full rounded-xl bg-background-2"
      />
    </NuxtLink>
  </div>
</template>
