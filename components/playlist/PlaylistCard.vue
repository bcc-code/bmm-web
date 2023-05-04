<script lang="ts" setup>
import { PlaylistModel } from "@bcc-code/bmm-sdk-fetch";

defineProps<{
  playlist: PlaylistModel;
}>();
</script>

<template>
  <div class="grid gap-4">
    <ProtectedImage
      v-if="playlist.cover"
      :src="playlist.cover"
      alt=""
      class="rounded-2xl aspect-square w-full bg-background-2"
    />
    <span class="text-ellipsis whitespace-nowrap overflow-hidden text-center">
      {{ playlist.title }}
    </span>
  </div>
</template>
