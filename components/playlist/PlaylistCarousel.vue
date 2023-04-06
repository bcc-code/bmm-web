<script lang="ts" setup>
import { PlaylistModel } from "@bcc-code/bmm-sdk-fetch";

const props = defineProps<{
  playlists: PlaylistModel[];
}>();
</script>

<template>
  <div class="flex gap-6 w-full overflow-x-auto h-64">
    <NuxtLink
      v-for="playlist in playlists"
      :key="playlist.id"
      :to="`/playlist/${playlist.id}`"
      class="h-full aspect-square"
    >
      <ProtectedImage
        :src="playlist.cover || ''"
        alt=""
        class="h-full rounded-xl bg-slate-100"
      />
    </NuxtLink>
  </div>
</template>
