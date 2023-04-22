<script lang="ts" setup>
import { TrackModel } from "@bcc-code/bmm-sdk-fetch";

const props = defineProps<{
  track: TrackModel;
  showThumbnail?: boolean;
}>();

const trackitemInnerClasses = computed(() => ({
  "trackitem-inner": true,
  "has-thumbnail": props.track.meta?.attachedPicture && props.showThumbnail,
}));
</script>

<template>
  <li class="trackitem" tabindex="0">
    <div :class="trackitemInnerClasses">
      <div v-if="track.meta?.attachedPicture && showThumbnail" class="w-full relative">
        <ProtectedImage :src="track.meta?.attachedPicture" alt="" class="rounded-md w-full aspect-square bg-slate-100" />
        <div class="only-show-on-hover absolute inset-0">
          <div class="absolute inset-0 rounded-md bg-black opacity-50 w-full h-full"></div>
          <Icon name="play" filled class="absolute inset-0 text-white text-2xl flex justify-center items-center" />
        </div>
      </div>
      <div class="track-title-and-artist">
        <h4 class="font-semibold">{{ track.meta?.title }}</h4>
        <span class="text-slate-700" v-if="track.meta?.artist">
          {{ track.meta?.artist }}
        </span>
      </div>
      <div class="dynamic-spacer"></div>
      <div>
        <span class="text-slate-400">{{ track.subtype }}</span>
      </div>
      <div class="ml-auto">
        <span class="text-slate-400">{{ track.meta?.time }}</span>
      </div>
      <div class="ml-auto flex justify-center items-center gap-3">
        <Icon name="download" filled class="only-show-on-hover text-2xl" />
        <Icon name="queue" filled class="only-show-on-hover text-2xl" />
        <Icon name="options" filled class="text-2xl" />
      </div>
    </div>
  </li>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .trackitem {
    @apply relative cursor-pointer;
  }

  .trackitem-inner {
    @apply relative z-20 py-3 rounded-xl grid gap-3 items-center justify-between;
    grid-template-columns: repeat(2, 1fr) 3.25rem repeat(3, 1fr);
  }
  .trackitem-inner.has-thumbnail {
    grid-template-columns: 2.5rem repeat(2, 1fr) 0px repeat(3, 1fr);
  }

  .dynamic-spacer {
    @apply w-full h-full;
  }

  .track-title-and-artist {
    @apply col-span-2;
  }

  .trackitem::after {
    @apply absolute z-10 -inset-x-4 -inset-y-1 rounded-lg;
    content: "";
  }

  .trackitem:hover::after,
  .trackitem:focus::after {
    @apply bg-slate-100;
  }

  .only-show-on-hover {
    @apply opacity-0;
  }

  .trackitem:hover .only-show-on-hover,
  .trackitem:focus .only-show-on-hover {
    @apply opacity-100;
  }
}
</style>
