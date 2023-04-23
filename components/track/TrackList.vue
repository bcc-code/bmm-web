<script lang="ts" setup>
import { TrackModel } from "@bcc-code/bmm-sdk-fetch";
import { MediaPlaylistInjectionKey } from "~/plugins/3.mediaPlayer";
import { DropdownMenuItem } from "../DropdownMenu.vue";

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
const { setCurrentTrack, addTrackToQueue } = inject(MediaPlaylistInjectionKey)!;
const showDropDownForTrack: Ref<null | string> = ref(null);

const toggleDropdownForTrack = (trackReference: string) => {
  if (showDropDownForTrack.value === trackReference) {
    showDropDownForTrack.value = null;
  } else {
    showDropDownForTrack.value = trackReference;
  }
};

const dropdownMenuItemsForTrack = (track: TrackModel): DropdownMenuItem[] => {
  const items = [];

  items.push({
    icon: "icon.play",
    text: "Play next",
    clickFunction: () => setCurrentTrack(track),
  });

  if (track?.meta?.parent?.id) {
    items.push({
      icon: "icon.category.album",
      text: "Go to album",
      link: `/album/${track.meta.parent.id}`,
    });
  }

  items.push({
    icon: "icon.queue",
    text: "Add to Queue",
    clickFunction: () => addTrackToQueue(track),
  });

  // TODO: change links
  items.push({
    icon: "icon.category.playlist",
    text: "Add to Playlist",
  });
  items.push({ icon: "icon.share", text: "Share track", link: "/browse" });
  items.push({
    icon: "icon.person",
    text: "Go to contributors",
    link: "/browse",
  });
  items.push({
    icon: "icon.information",
    text: "More information",
    link: "/browse",
  });

  return items;
};
</script>

<template>
  <ol class="divide-y divide-slate-100 w-full">
    <template v-if="showSkeleton">
      <li
        v-for="skeleton in skeletonCount"
        :key="skeleton"
        class="w-full h-11 bg-slate-100 rounded-lg my-6 animate-pulse"
      ></li>
    </template>
    <template v-else>
      <TrackItem
        v-for="(track, i) in tracks"
        :key="track.id || 0"
        :track="track"
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
