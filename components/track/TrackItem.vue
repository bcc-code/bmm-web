<script lang="ts" setup>
import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();
const { addToQueue } = useNuxtApp().$mediaPlayer;

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

const selectedTrack: Ref<TrackModel | null> = ref(null);
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
      <div v-if="showThumbnail" class="hidden lg:flex flex-col justify-center">
        <div class="relative aspect-square w-10">
          <CoverImage
            :src="track.meta?.attachedPicture"
            class="w-10 rounded-md"
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

      <div v-if="!showThumbnail" class="relative hidden lg:block"></div>
      <div
        class="flex flex-col justify-center col-span-2 lg:col-span-1 min-w-0"
      >
        <h4
          class="block truncate text-[17px] leading-6 font-medium"
          :title="track.meta?.title || ''"
        >
          {{ track.meta?.title }}
        </h4>
        <span
          v-if="track.meta?.artist"
          :title="track.meta?.artist"
          class="block truncate text-label-2 text-[15px] leading-5"
        >
          {{ track.meta?.artist }}
        </span>
      </div>
      <div v-if="!isTrackTypeKnown" class="flex items-center min-w-0">
        <span class="text-label-3 truncate">{{ track.subtype }}</span>
      </div>
      <div v-if="isTrackTypeKnown" class="flex items-center min-w-0">
        <span class="text-label-3 truncate">{{ track.meta?.album }}</span>
      </div>
      <div class="flex items-center">
        <span class="text-label-3">
          <TimeDuration
            :duration="((track.media || [])[0]?.files || [])[0]?.duration || 0"
          ></TimeDuration>
        </span>
      </div>
      <div class="flex items-center gap-1">
        <button
          class="rounded-full p-2 opacity-0 hover:bg-label-separator hover:opacity-100 group-hover:opacity-100 group-focus:opacity-100"
          @click="selectedTrack = track"
          @click.stop
        >
          <NuxtIcon name="icon.category.playlist" class="text-2xl" />
        </button>
        <button
          class="rounded-full p-2 opacity-0 hover:bg-label-separator hover:opacity-100 group-hover:opacity-100 group-focus:opacity-100"
          :aria-label="t('track.a11y.queue')"
          @click="addToQueue(track)"
          @click.stop
        >
          <NuxtIcon name="queue" class="text-2xl" />
        </button>
        <TrackMenu :track="track" button-class="p-2 hover:bg-label-separator" />
      </div>
    </div>
    <slot />

    <TrackAddToPlaylist
      v-if="selectedTrack"
      :track-id="selectedTrack.id"
      @close="selectedTrack = null"
    ></TrackAddToPlaylist>
  </li>
</template>
