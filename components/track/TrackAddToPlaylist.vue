<script lang="ts" setup>
import { TrackCollectionApi } from "@bcc-code/bmm-sdk-fetch";

const props = defineProps<{
  trackId: number;
}>();
const emit = defineEmits<{
  close: [];
}>();

async function addToPlaylist(selectedPlaylist: number) {
  await new TrackCollectionApi().trackCollectionIdPost({
    id: selectedPlaylist,
    link: [`</track/${props.trackId}>,`],
  });
}
</script>

<template>
  <AddToPlaylist :list-selected="addToPlaylist" @close="emit('close')">
  </AddToPlaylist>
</template>
