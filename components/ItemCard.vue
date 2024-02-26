<script lang="ts" setup>
import type {
  AlbumModel,
  PlaylistModel,
  PodcastModel,
} from "@bcc-code/bmm-sdk-fetch";

defineProps<{
  item: PlaylistModel | AlbumModel | PodcastModel;
}>();
</script>

<template>
  <div class="grid w-52 flex-shrink-0 basis-52 gap-4">
    <CoverImage :src="item.cover" class="w-full rounded-2xl" />
  </div>
</template>
