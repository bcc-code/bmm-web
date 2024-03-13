<script lang="ts" setup>
import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";

const props = withDefaults(
  defineProps<{
    showSkeleton?: boolean;
    skeletonCount?: number;
    tracks: TrackModel[] | null;
    trackTypeIsKnown: boolean | null;
  }>(),
  {
    skeletonCount: 5,
    trackTypeIsKnown: null,
  },
);

const { setQueue } = useNuxtApp().$mediaPlayer;

const isTrackTypeKnown = () => {
  if (props.trackTypeIsKnown !== null) return props.trackTypeIsKnown;
  const firstType = props.tracks?.[0]?.subtype;
  return (
    props.tracks?.every(
      (track: TrackModel) =>
        track.subtype === firstType ||
        (track.subtype === "song" && firstType === "singsong") ||
        (track.subtype === "singsong" && firstType === "song"),
    ) || false
  );
};
</script>

<template>
  <ol
    class="grid grid-cols-tracklist grid-rows-1 gap-x-4 w-full divide-y divide-label-separator"
  >
    <template v-if="showSkeleton">
      <li
        v-for="skeleton in skeletonCount"
        :key="skeleton"
        class="my-6 h-11 w-full animate-pulse rounded-lg bg-background-2"
      ></li>
    </template>
    <template v-else-if="tracks">
      <TrackItem
        v-for="(track, i) in tracks"
        :key="track.id"
        :track="track"
        :is-track-type-known="isTrackTypeKnown()"
        show-thumbnail
        @play-track="setQueue(tracks, i)"
      >
      </TrackItem>
    </template>
  </ol>
</template>
