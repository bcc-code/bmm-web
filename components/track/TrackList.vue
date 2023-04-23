<script lang="ts" setup>
import { TrackModel } from "@bcc-code/bmm-sdk-fetch";
import { MediaPlaylistInjectionKey } from "~/plugins/3.mediaPlayer";

withDefaults(
  defineProps<{
    showSkeleton?: boolean;
    skeletonCount?: number;
    tracks: TrackModel[] | null;
  }>(),
  {
    skeletonCount: 5,
  }
);
const { setCurrentSong } = inject(MediaPlaylistInjectionKey)!;
</script>

<template>
  <ol class="divide-y divide-label-separator w-full">
    <template v-if="showSkeleton">
      <li
        v-for="skeleton in skeletonCount"
        :key="skeleton"
        class="w-full h-11 bg-background-2 rounded-lg my-6 animate-pulse"
      ></li>
    </template>
    <template v-else>
      <TrackItem
        v-for="track in tracks"
        :key="track.id || 0"
        :track="track"
        show-thumbnail
        @click="setCurrentSong(track.media?.[0]?.files?.[0]?.url || '')"
      />
    </template>
  </ol>
</template>
