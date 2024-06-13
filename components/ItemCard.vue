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
  <div
    class="grid w-40 flex-shrink-0 gap-4 sm:w-52 sm:basis-52"
    :title="item.title || ''"
  >
    <CoverImage :src="item.cover" class="w-full rounded-2xl" />
  </div>
</template>
