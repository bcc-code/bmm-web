<script lang="ts" setup>
import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";
import { defineProps } from "vue";
import ProtectedImage from "./ProtectedImage.vue";

const props = defineProps<{
  track: TrackModel;
}>();

// const tracks: Ref<TrackModel[]> = ref([]);
// const trackId = Number(props.trackId);

// new TrackApi()
//   .trackGet()
//   .then((result) => {
//     tracks.value = result;
//   })
//   .catch(() => {});
</script>

<template>
  <div class="grid gap-4 grid-cols-3">
    <div class="flex flex-row m-2 w-96">
      <ProtectedImage
        v-if="track.meta?.attachedPicture"
        :src="track.meta?.attachedPicture"
        class="h-10 aspect-square rounded"
      />
      <span class="pl-3">
        <span class="font-medium text-black text-{17px}">
          {{ props.track.meta?.tracknumber }}. {{ track.title }}
        </span>
        <br />
        <span class="text-sm text-center text-{15px} text-{gray}">
          {{ track.meta?.artist }}
        </span>
      </span>
    </div>
    <span class="grid content-center">{{ track.subtype }}</span>
    <div class="grid content-center">{{ $t("...") }}</div>
  </div>
</template>
