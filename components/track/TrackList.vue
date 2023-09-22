<script lang="ts" setup>
import { TrackModel } from "@bcc-code/bmm-sdk-fetch";

const props = withDefaults(
  defineProps<{
    showSkeleton?: boolean;
    skeletonCount?: number;
    tracks: TrackModel[] | null;
  }>(),
  {
    skeletonCount: 5,
  }
);

const { setQueue } = useNuxtApp().$mediaPlayer;
const showDropDownForTrack = ref<string | null>(null);

const isTrackTypeKnown = () => {
  const firstType = props.tracks?.[0]?.subtype;
  return (
    props.tracks?.every(
      (track: TrackModel) =>
        track.subtype === firstType ||
        (track.subtype === "song" && firstType === "singsong") ||
        (track.subtype === "singsong" && firstType === "song")
    ) || false
  );
};

const toggleDropdownForTrack = (trackReference: string) => {
  if (showDropDownForTrack.value === trackReference) {
    showDropDownForTrack.value = null;
  } else {
    showDropDownForTrack.value = trackReference;
  }
};
</script>

<template>
  <ol class="w-full divide-y divide-label-separator">
    <template v-if="showSkeleton">
      <li
        v-for="skeleton in skeletonCount"
        :key="skeleton"
        class="my-6 h-11 w-full animate-pulse rounded-lg bg-background-2 dark:bg-background-dark-2"
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
        @open-options="toggleDropdownForTrack(`${track.id}-${i}`)"
      >
      </TrackItem>
    </template>
  </ol>
</template>
