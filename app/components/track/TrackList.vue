<script lang="ts" setup>
import { useDraggable } from "vue-draggable-plus";
import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";

const props = withDefaults(
  defineProps<{
    showSkeleton?: boolean;
    skeletonCount?: number;
    tracks: TrackModel[] | null;
    trackTypeIsKnown?: boolean;
    albumIsKnown?: boolean;
    showThumbnails?: boolean;
    addDropdownItems?: (items: DropdownMenuItem[], track: TrackModel) => void;
    origin?: string;
    reorder?: boolean;
  }>(),
  {
    skeletonCount: 5,
    addDropdownItems: undefined,
    trackTypeIsKnown: undefined,
    albumIsKnown: false,
    origin: "",
    reorder: false,
  },
);

const emit = defineEmits<{
  reorder: [tracks: TrackModel[]];
}>();

const { setQueue } = useNuxtApp().$mediaPlayer;

const isTrackTypeKnown = () => {
  if (props.trackTypeIsKnown !== undefined) return props.trackTypeIsKnown;
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

const orderableTracks = ref<TrackModel[]>([]);
onMounted(() => {
  if (props.tracks) {
    orderableTracks.value = props.tracks;
  }
});
const trackList = ref<HTMLOListElement>();
useDraggable<TrackModel>(trackList, orderableTracks, {
  animation: 200,
  disabled: !props.reorder,
  ghostClass: "opacity-50",
  handle: ".drag-handle",
  onSort({ oldIndex, newIndex }) {
    if (oldIndex === undefined || newIndex === undefined || !props.tracks) {
      return;
    }
    const tracks = [...props.tracks];
    const [removed] = tracks.splice(oldIndex, 1);
    if (!removed) {
      return;
    }
    tracks.splice(newIndex, 0, removed);
    emit("reorder", tracks);
  },
});
</script>

<template>
  <ol
    ref="trackList"
    class="grid w-full grid-cols-tracklist grid-rows-1 gap-x-4 divide-y divide-label-separator"
  >
    <template v-if="showSkeleton">
      <TrackItemSkeleton
        v-for="skeleton in skeletonCount"
        :key="skeleton"
        :show-thumbnail="showThumbnails"
      />
    </template>
    <template v-else-if="tracks">
      <TrackItem
        v-for="(track, i) in tracks"
        :key="track.id"
        :track="track"
        :is-track-type-known="isTrackTypeKnown()"
        :show-thumbnail="showThumbnails"
        :add-dropdown-items="props.addDropdownItems"
        :is-album-known="props.albumIsKnown"
        :origin="props.origin"
        :show-drag-handle="props.reorder"
        @play-track="setQueue(tracks, i, props.origin)"
      >
      </TrackItem>
    </template>
  </ol>
</template>
