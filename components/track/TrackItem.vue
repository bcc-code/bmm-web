<script lang="ts" setup>
import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();

defineProps<{
  track: TrackModel;
  showThumbnail?: boolean;
  isTrackTypeKnown: boolean;
}>();

defineSlots<{
  default: (props: {}) => any;
}>();

const emit = defineEmits<{ "play-track": [] }>();

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
  <li
    class="group grid col-span-full relative grid-cols-subgrid cursor-pointer gap-3 py-3"
    @click.stop="playTrack"
  >
    <div
      class="absolute -inset-x-4 -inset-y-0 rounded-xl bg-background-2 opacity-0 group-hover:opacity-100"
    ></div>

    <div class="relative grid col-span-full grid-cols-subgrid">
      <div
        v-if="track.meta?.attachedPicture && showThumbnail"
        class="flex items-center hidden lg:block"
      >
        <div class="relative">
          <ProtectedImage
            :src="track.meta?.attachedPicture"
            class="aspect-square w-10 rounded-md bg-background-2"
          />
          <div class="absolute w-10 inset-0 opacity-0 group-hover:opacity-100">
            <div
              class="absolute inset-0 h-full w-full rounded-md bg-black-1 opacity-50 dark:bg-white-1"
            ></div>
            <NuxtIcon
              name="play"
              class="absolute inset-0 flex items-center justify-center text-2xl text-white-1 dark:text-black-1"
            />
          </div>
        </div>
      </div>

      <div
        v-if="!(track.meta?.attachedPicture && showThumbnail)"
        class="relative hidden lg:block"
      ></div>
      <div
        class="flex flex-col justify-center col-span-2 lg:col-span-1 min-w-0"
      >
        <h4
          class="block truncate font-semibold"
          :title="track.meta?.title || ''"
        >
          {{ track.meta?.title }}
        </h4>
        <span
          v-if="track.meta?.artist"
          :title="track.meta?.artist"
          class="block truncate text-label-1"
        >
          {{ track.meta?.artist }}
        </span>
      </div>
      <div v-if="!isTrackTypeKnown" class="flex items-center min-w-0">
        <span class="text-label-2 truncate">{{ track.subtype }}</span>
      </div>
      <div v-if="isTrackTypeKnown" class="flex items-center min-w-0">
        <span class="text-label-2 truncate">{{ track.meta?.album }}</span>
      </div>
      <div class="flex items-center">
        <span class="text-label-2">{{
          secondsToTime(track.media?.[0]?.files?.[0]?.duration)
        }}</span>
      </div>
      <div class="flex items-center gap-1">
        <button
          class="px-2 py-0 opacity-0 hover:bg-[red] hover:opacity-100 focus:opacity-100 group-hover:opacity-100 group-focus:opacity-100"
          :aria-label="t('track.a11y.download')"
          @click.stop
        >
          <NuxtIcon name="download" class="text-2xl" />
        </button>
        <button
          class="px-2 py-0 opacity-0 hover:bg-[red] hover:opacity-100 focus:opacity-100 group-hover:opacity-100 group-focus:opacity-100"
          :aria-label="t('track.a11y.queue')"
          @click.stop
        >
          <NuxtIcon name="queue" class="text-2xl" />
        </button>
        <TrackMenu :track="track" button-class="px-2"></TrackMenu>
      </div>
    </div>
    <slot />
  </li>
</template>
