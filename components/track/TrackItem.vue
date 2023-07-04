<script lang="ts" setup>
import { TrackModel } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();

defineProps<{
  track: TrackModel;
  showThumbnail?: boolean;
  isTrackTypeKnown: boolean;
}>();

defineSlots<{
  default: (props: {}) => any;
}>();

const emit = defineEmits<{ "open-options": []; "play-track": [] }>();

function openOptions() {
  emit("open-options");
}

function playTrack() {
  emit("play-track");
}

function secondsToTime(totalSeconds: number | undefined) {
  if (totalSeconds === undefined) return "";
  const minutes = Math.ceil(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
</script>

<template>
  <li class="group relative mr-3 cursor-pointer py-3" @click="playTrack">
    <div
      class="absolute -inset-x-4 -inset-y-0 rounded-xl bg-background-2 opacity-0 group-hover:opacity-100 dark:bg-background-dark-2"
    ></div>
    <div class="relative flex items-center justify-between gap-3">
      <div
        v-if="track.meta?.attachedPicture && showThumbnail"
        class="relative w-10"
      >
        <ProtectedImage
          :src="track.meta?.attachedPicture"
          alt=""
          class="aspect-square w-10 rounded-md bg-background-2 dark:bg-background-dark-2"
        />
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100">
          <div
            class="absolute inset-0 h-full w-full rounded-md bg-black-1 opacity-50 dark:bg-white-1"
          ></div>
          <NuxtIcon
            name="play"
            filled
            class="absolute inset-0 flex items-center justify-center text-2xl text-white-1 dark:text-black-1"
          />
        </div>
      </div>
      <div class="mr-auto w-1/3">
        <h4
          class="overflow-hidden text-ellipsis whitespace-nowrap font-semibold"
          :title="track.meta?.title || ''"
        >
          {{ track.meta?.title }}
        </h4>
        <span
          v-if="track.meta?.artist"
          :title="track.meta?.artist"
          class="block overflow-hidden text-ellipsis whitespace-nowrap text-label-1 dark:text-label-dark-1"
        >
          {{ track.meta?.artist }}
        </span>
      </div>
      <div
        v-if="!(track.meta?.attachedPicture && showThumbnail)"
        class="block h-1 w-10"
      ></div>
      <div v-if="!isTrackTypeKnown">
        <span class="text-label-2 dark:text-label-dark-2">{{
          track.subtype
        }}</span>
      </div>
      <div v-if="isTrackTypeKnown">
        <span class="text-label-2 dark:text-label-dark-2">{{
          track.meta?.album
        }}</span>
      </div>
      <div class="ml-auto">
        <span class="text-label-2 dark:text-label-dark-2">{{
          secondsToTime(track.media?.[0]?.files?.[0]?.duration)
        }}</span>
      </div>
      <div class="ml-auto flex items-center justify-center gap-1">
        <button
          class="px-2 py-0 opacity-0 hover:bg-[red] hover:opacity-100 focus:opacity-100 group-hover:opacity-100 group-focus:opacity-100"
          :aria-label="t('track.a11y.download')"
          @click.stop
        >
          <NuxtIcon name="download" filled class="text-2xl" />
        </button>
        <button
          class="px-2 py-0 opacity-0 hover:bg-[red] hover:opacity-100 focus:opacity-100 group-hover:opacity-100 group-focus:opacity-100"
          :aria-label="t('track.a11y.queue')"
          @click.stop
        >
          <NuxtIcon name="queue" filled class="text-2xl" />
        </button>
        <button
          :aria-label="t('track.a11y.options')"
          class="focus:bg-lime-400 rounded-lg px-2 py-0"
          @click.stop="openOptions"
        >
          <NuxtIcon name="options" filled class="text-2xl" />
        </button>
      </div>
    </div>
    <slot />
  </li>
</template>
