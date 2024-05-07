<script setup lang="ts">
import { MediaPlayerStatus } from "~/plugins/mediaPlayer/mediaPlayer";

const {
  status,
  play,
  pause,
  currentTrack,
  currentPosition,
  currentTrackDuration,
  isLoading,
} = useNuxtApp().$mediaPlayer;

const onPointerUpProgressBar = (event: PointerEvent) => {
  const rect = (event.currentTarget as Element)?.getBoundingClientRect();
  currentPosition.value =
    ((event.clientX - rect.left) / rect.width) * currentTrackDuration.value;
};
const onPointerDownProgressBar = () => {
  // TODO: let user drag the progress-bar on mouse-down,
  // update the time while keeping the song playing,
  // and update the players position only on mouse-up.
};
</script>

<template>
  <div class="flex h-full w-full items-start p-3">
    <div class="flex min-w-0 flex-1 gap-4">
      <CoverImage
        :src="currentTrack?.meta?.attachedPicture"
        class="h-[48px] rounded-md"
      />
      <div
        class="flex min-w-0 flex-1 flex-col gap-1 truncate whitespace-nowrap"
      >
        <h3
          class="truncate text-lg font-semibold leading-tight"
          :title="currentTrack?.title || ''"
        >
          {{ currentTrack?.title }}
        </h3>
        <div class="min-w-0 truncate text-base leading-snug text-label-2">
          <span
            v-if="currentTrack?.meta?.artist"
            :title="currentTrack?.meta?.artist"
          >
            {{ currentTrack.meta?.artist }}
          </span>
          <span v-if="currentTrack?.meta?.artist && currentTrack?.meta?.album">
            -
          </span>
          <span
            v-if="currentTrack?.meta?.album"
            :title="currentTrack?.meta?.album"
          >
            {{ currentTrack.meta?.album }}
          </span>
        </div>
      </div>
      <button
        v-if="isLoading"
        class="flex aspect-square w-12 items-center justify-center text-2xl"
      >
        <NuxtIcon name="icon.loading.animation" filled />
      </button>
      <button
        v-if="!isLoading && status === MediaPlayerStatus.Playing"
        class="flex aspect-square w-12 items-center justify-center text-3xl transition-all duration-200 ease-out hover:text-4xl"
        @click.stop="pause()"
      >
        <NuxtIcon name="icon.pause.large" />
      </button>
      <button
        v-if="!isLoading && status !== MediaPlayerStatus.Playing"
        class="flex aspect-square w-12 items-center justify-center text-3xl transition-all duration-200 ease-out hover:text-4xl"
        @click.stop="play()"
      >
        <NuxtIcon name="play" />
      </button>
    </div>
    <!-- Icon top left -->
    <svg
      class="absolute left-0 top-0 opacity-0 transition-all duration-200 ease-out group-hover:-left-1 group-hover:-top-1 group-hover:opacity-100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="11"
      viewBox="0 0 11 11"
    >
      <path
        d="M0 1.5C0 0.671573 0.671573 0 1.5 0H7.37868C8.71504 0 9.38429 1.61571 8.43934 2.56066L2.56066 8.43934C1.61572 9.38428 0 8.71504 0 7.37868V1.5Z"
        fill="currentColor"
      />
    </svg>
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="absolute bottom-0 left-1 right-1 h-1 w-full transition-all duration-200 ease-out hover:h-1.5"
      @pointerdown="onPointerDownProgressBar"
      @pointerup="onPointerUpProgressBar"
      @click.stop
    >
      <rect width="100%" height="100%" class="fill-background-2" />
      <rect
        v-if="
          Number.isFinite(currentPosition) &&
          Number.isFinite(currentTrackDuration)
        "
        :width="(currentPosition / currentTrackDuration) * 100 + '%'"
        height="100%"
        class="fill-label-1"
      />
    </svg>
  </div>
</template>
