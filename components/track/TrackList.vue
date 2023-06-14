<script lang="ts" setup>
import { TrackModel } from "@bcc-code/bmm-sdk-fetch";
import { MediaPlaylistInjectionKey } from "~/plugins/3.mediaPlayer";
import { DropdownMenuItem } from "../DropdownMenu.vue";

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

const { setCurrentTrack, addTrackToQueue } = inject(MediaPlaylistInjectionKey)!;
const showDropDownForTrack: Ref<null | string> = ref(null);

const isTrackTypeKnown = () => {
  const firstType = props.tracks?.[0]?.subtype;
  console.log("first type", firstType);
  const tracksWithDifferentType = props.tracks?.filter(
    (track: TrackModel) =>
      track.subtype !== firstType ||
      (track.subtype === "song" && firstType === "singsong") ||
      (track.subtype === "singsong" && firstType === "song")
  );
  return tracksWithDifferentType?.length === 0;
};

const toggleDropdownForTrack = (trackReference: string) => {
  if (showDropDownForTrack.value === trackReference) {
    showDropDownForTrack.value = null;
  } else {
    showDropDownForTrack.value = trackReference;
  }
};

const dropdownMenuItemsForTrack = (track: TrackModel) => {
  const items: DropdownMenuItem[] = [];

  items.push({
    icon: "icon.play",
    text: "Play next",
    clickFunction: () => setCurrentTrack(track),
  });

  if (track?.meta?.parent?.id) {
    items.push({
      icon: "icon.category.album",
      text: "Go to album",
      link: { name: "album-id", params: { id: track.meta.parent.id } },
    });
  }

  items.push({
    icon: "icon.queue",
    text: "Add to Queue",
    clickFunction: () => addTrackToQueue(track),
  });

  // TODO: add link
  items.push({
    icon: "icon.category.playlist",
    text: "Add to Playlist",
  });
  items.push({
    icon: "icon.share",
    text: "Share track",
    link: { name: "browse" }, // TODO: change link
  });
  items.push({
    icon: "icon.person",
    text: "Go to contributors",
    link: { name: "browse" }, // TODO: change link
  });
  items.push({
    icon: "icon.information",
    text: "More information",
    link: { name: "browse" }, // TODO: change link
  });

  return items;
};
</script>

<template>
  <ol class="w-full divide-y divide-label-separator">
    <template v-if="showSkeleton">
      <li
        v-for="skeleton in skeletonCount"
        :key="skeleton"
        class="my-6 h-11 w-full animate-pulse rounded-lg bg-background-2"
      ></li>
    </template>
    <template v-else>
      <TrackItem
        v-for="(track, i) in tracks"
        :key="track.id"
        :track="track"
        :is-track-type-known="isTrackTypeKnown()"
        show-thumbnail
        @play-track="setCurrentTrack(track)"
        @open-options="toggleDropdownForTrack(`${track.id}-${i}`)"
      >
        <DropdownMenu
          v-if="showDropDownForTrack === `${track.id}-${i}`"
          :items="dropdownMenuItemsForTrack(track)"
          @close="toggleDropdownForTrack(`${track.id}-${i}`)"
        ></DropdownMenu>
      </TrackItem>
    </template>
  </ol>
</template>
