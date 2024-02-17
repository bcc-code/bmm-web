<script lang="ts" setup>
import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";

const props = withDefaults(
  defineProps<{
    showSkeleton?: boolean;
    skeletonCount?: number;
    tracks: TrackModel[] | null;
  }>(),
  {
    skeletonCount: 5,
  },
);

const { setQueue, currentTrack } = useNuxtApp().$mediaPlayer;

const isTrackTypeKnown = () => {
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

watch(
  [() => props.tracks, () => contentLanguageStore().selectedLanguage],
  ([newTracks, newLanguage]) =>
    newLanguage !== currentTrack?.value?.language && newTracks?.length
      ? setQueue(newTracks)
      : undefined,
);
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
