<script lang="ts" setup>
import {
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
    <ProtectedImage
      v-if="item.cover"
      :src="item.cover"
      alt=""
      class="aspect-square w-full rounded-2xl bg-background-2"
    />
    <span class="overflow-hidden text-ellipsis whitespace-nowrap text-center">
      {{ item.title }}
    </span>
  </div>
</template>
