<script lang="ts" setup>
import { TrackModel } from "@bcc-code/bmm-sdk-fetch";

defineProps<{
  track: TrackModel;
  showThumbnail?: boolean;
}>();
</script>

<template>
  <li class="py-3 rounded-xl flex gap-3 items-center">
    <ProtectedImage
      v-if="track.meta?.attachedPicture && showThumbnail"
      :src="track.meta?.attachedPicture"
      alt=""
      class="rounded-md w-10 aspect-square bg-slate-100"
    />
    <div class="w-1/2">
      <h4 class="font-semibold">{{ track.meta?.title }}</h4>
      <span class="text-slate-700" v-if="track.meta?.artist">
        {{ track.meta?.artist }}
      </span>
    </div>
    <div class="">
      <span class="text-slate-400">{{ track.subtype }}</span>
    </div>
  </li>
</template>
