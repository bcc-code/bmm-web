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
const { setCurrentSong, addSongToQueue } = inject(MediaPlaylistInjectionKey)!;
const showDropDownForTrackId = ref(0);

const toggleDropdownForTrack = (trackId: number) => {
  if (showDropDownForTrackId.value === trackId) {
    showDropDownForTrackId.value = 0;
  } else {
    showDropDownForTrackId.value = trackId;
  }
};

const dropdownMenuItemsForTrack = (track: TrackModel): DropdownMenuItem[] => {
  const items = [];

  if (track?.meta?.parent?.id) {
    items.push({ text: "Go to album", link: `/album/${track.meta.parent.id}` });
  }

  items.push({
    text: "Add to Queue",
    function: () => addSongToQueue(track.media?.[0]?.files?.[0]?.url || ""),
  });

  // TODO: change links
  items.push({ text: "Add to Playlist", link: "/browse" });
  items.push({ text: "Share track", link: "/browse" });
  items.push({ text: "Go to contributors", link: "/browse" });
  items.push({ text: "More information", link: "/browse" });

  return items;
};
</script>

<template>
  <ol class="divide-y divide-slate-100 w-full">
    <template v-if="showSkeleton">
      <li
        class="w-full h-11 bg-slate-100 rounded-lg my-6 animate-pulse"
        v-for="skeleton in skeletonCount"
        :key="skeleton"
      ></li>
    </template>
    <template v-else>
      <TrackItem
        v-for="track in tracks"
        :key="track.id || 0"
        :track="track"
        show-thumbnail
        @play-track="setCurrentSong(track.media?.[0]?.files?.[0]?.url || '')"
        @open-options="toggleDropdownForTrack(track.id || 0)"
      >
        <DropdownMenu
          v-if="showDropDownForTrackId === track.id"
          :items="dropdownMenuItemsForTrack(track)"
          @close="toggleDropdownForTrack(track.id || 0)"
        ></DropdownMenu>
      </TrackItem>
    </template>
  </ol>
</template>
