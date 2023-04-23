<script lang="ts" setup>
import { TrackModel } from "@bcc-code/bmm-sdk-fetch";

defineProps<{
  track: TrackModel;
  showThumbnail?: boolean;
}>();
</script>

<template>
  <li class="group relative py-3 block cursor-pointer">
    <div
      class="opacity-0 group-hover:opacity-100 absolute -inset-y-0 -inset-x-4 rounded-xl bg-background-2"
    ></div>
    <div class="relative flex gap-3 items-center justify-between">
      <div
        v-if="track.meta?.attachedPicture && showThumbnail"
        class="relative w-10"
      >
        <ProtectedImage
          :src="track.meta?.attachedPicture"
          alt=""
          class="rounded-md w-10 aspect-square bg-background-2"
        />
        <div class="opacity-0 group-hover:opacity-100 absolute inset-0">
          <div
            class="absolute inset-0 rounded-md bg-black-1 opacity-50 w-full h-full"
          ></div>
          <IconComponent
            name="play"
            filled
            class="absolute inset-0 text-white-1 text-2xl flex justify-center items-center"
          />
        </div>
      </div>
      <div class="mr-auto w-1/3">
        <h4 class="font-semibold">{{ track.meta?.title }}</h4>
        <span v-if="track.meta?.artist" class="text-label-1">
          {{ track.meta?.artist }}
        </span>
      </div>
      <div
        v-if="!(track.meta?.attachedPicture && showThumbnail)"
        class="block w-10 h-1"
      ></div>
      <div>
        <span class="text-label-2">{{ track.subtype }}</span>
      </div>
      <div class="ml-auto">
        <span class="text-label-2">{{ track.meta?.time }}</span>
      </div>
      <div class="ml-auto flex justify-center items-center gap-3">
        <IconComponent
          name="download"
          filled
          class="opacity-0 group-hover:opacity-100 text-2xl"
        />
        <IconComponent
          name="queue"
          filled
          class="opacity-0 group-hover:opacity-100 text-2xl"
        />
        <IconComponent name="options" filled class="text-2xl" />
      </div>
    </div>
  </li>
</template>
