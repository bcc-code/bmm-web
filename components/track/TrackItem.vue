<script lang="ts" setup>
import { TrackModel } from "@bcc-code/bmm-sdk-fetch";

defineProps<{
  track: TrackModel;
  showThumbnail?: boolean;
}>();
</script>

<template>
  <li class="group relative py-3 cursor-pointer">
    <div class="opacity-0 group-hover:opacity-100 absolute -inset-y-2 -inset-x-4 rounded-xl bg-slate-100"></div>
    <div class="relative flex gap-3 items-center justify-between">
      <div v-if="track.meta?.attachedPicture && showThumbnail" class="relative w-10">
        <ProtectedImage :src="track.meta?.attachedPicture" alt="" class="rounded-md w-10 aspect-square bg-slate-100" />
        <div class="opacity-0 group-hover:opacity-100 absolute inset-0">
          <div class="absolute inset-0 rounded-md bg-black opacity-50 w-full h-full"></div>
          <Icon name="play" filled class="absolute inset-0 text-white text-2xl flex justify-center items-center" />
        </div>
      </div>
      <div class="mr-auto w-1/3">
        <h4 class="font-semibold">{{ track.meta?.title }}</h4>
        <span class="text-slate-700" v-if="track.meta?.artist">
          {{ track.meta?.artist }}
        </span>
      </div>
      <div v-if="!(track.meta?.attachedPicture && showThumbnail)" class="block w-10 h-1"></div>
      <div>
        <span class="text-slate-400">{{ track.subtype }}</span>
      </div>
      <div class="ml-auto">
        <span class="text-slate-400">{{ track.meta?.time }}</span>
      </div>
      <div class="ml-auto flex justify-center items-center gap-3">
        <Icon name="download" filled class="opacity-0 group-hover:opacity-100 text-2xl" />
        <Icon name="queue" filled class="opacity-0 group-hover:opacity-100 text-2xl" />
        <Icon name="options" filled class="text-2xl" />
      </div>
    </div>
  </li>
</template>
