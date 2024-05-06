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
  <div class="">
    <CoverImage :src="item.cover" class="w-full rounded-2xl" />
  </div>
</template>
