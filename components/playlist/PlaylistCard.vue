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
      class="aspect-square w-full rounded-2xl bg-background-2"
    />
    <span class="overflow-hidden text-ellipsis whitespace-nowrap text-center">
      {{ playlist.title }}
    </span>
  </div>
</template>
