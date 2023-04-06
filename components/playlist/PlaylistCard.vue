<script lang="ts" setup>
import { PlaylistModel } from "@bcc-code/bmm-sdk-fetch";

const props = defineProps<{
  playlist: PlaylistModel;
}>();
</script>

<template>
  <div class="grid gap-4">
    <ProtectedImage
      v-if="playlist.cover"
      :src="playlist.cover"
      alt=""
      class="rounded-xl aspect-square w-full bg-slate-100"
    />
    <h3 class="leading-tight text-ellipsis whitespace-nowrap overflow-hidden">
      {{ playlist.title }}
    </h3>
  </div>
</template>
