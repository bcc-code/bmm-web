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
  <div :title="item.title || ''">
    <CoverImage :src="item.cover" class="w-full rounded-2xl" />
    <span
      class="type-paragraph-3 mt-2 line-clamp-1 w-full text-center leading-snug text-label-1"
    >
      {{ item.title }}
    </span>
  </div>
</template>
