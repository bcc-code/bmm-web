<script setup lang="ts">
import { ref, Ref } from "vue";
import { TrackApi, TrackModel } from "@bcc-code/bmm-sdk-fetch";

import ProtectedImage from "./ProtectedImage.vue";

const tracks: Ref<TrackModel[]> = ref([]);

new TrackApi()
  .trackGet()
  .then((r) => {
    tracks.value = r;
  })
  .catch(() => null /* TODO: implement error-handling */);
</script>

<template>
  <div
    v-for="track in tracks"
    :key="track.id || 0"
    class="grid gap-4 grid-cols-3"
  >
    <div v-if="track" class="flex flex-row m-2">
      <ProtectedImage
        v-if="track.meta?.attachedPicture"
        :src="track.meta?.attachedPicture"
        class="h-10 aspect-square rounded"
      />
      <span v-if="track" id="title" class="w-full">
        {{ track.meta?.tracknumber }}. {{ track.meta?.title }}<br />
        {{ track.meta?.album }}<br />
      </span>
    </div>
    <div v-if="track.subtype" id="">
      {{ track.subtype?.charAt(0).toUpperCase() + track.subtype?.slice(1) }}
    </div>
    <div>...</div>
  </div>
</template>
