<script setup lang="ts">
import { MediaPlayerStatus } from "~/plugins/mediaPlayer/mediaPlayer";

const { t } = useI18n();

const open = defineModel({
  type: Boolean,
  default: false,
});

const {
  status,
  play,
  pause,
  currentTrack,
  currentPosition,
  currentTrackDuration,
  isLoading,
  queue,
  next,
  hasNext,
  previous,
  hasPrevious,
  rewind,
  fastForward,
  repeatStatus,
  volume,
} = useNuxtApp().$mediaPlayer;

let trackMouseForPosition = false;
const newPosition = ref<number | null>(null);
const positionSvg = ref<HTMLElement | null>(null);
const updatePosition = (event: PointerEvent) => {
  if (!positionSvg.value) return;
  const rect = positionSvg.value?.getBoundingClientRect();
  const newValue = (event.clientX - rect.left) / rect.width;
  newPosition.value = Math.min(1, Math.max(newValue, 0));
};

const positionOnPointerMove = (event: PointerEvent) => {
  if (trackMouseForPosition) updatePosition(event);
};
const positionOnPointerCancel = () => {
  trackMouseForPosition = false;
  if (newPosition.value !== null) {
    currentPosition.value = newPosition.value * currentTrackDuration.value;
    newPosition.value = null;
  }
};
const positionOnPointerDown = (event: PointerEvent) => {
  trackMouseForPosition = true;
  updatePosition(event);
};
const positionOnPointerUp = (event: PointerEvent) => {
  trackMouseForPosition = false;
  updatePosition(event);
  if (newPosition.value !== null) {
    currentPosition.value = newPosition.value * currentTrackDuration.value;
    newPosition.value = null;
  }
};
const currentOrNewPosition = computed(() =>
  newPosition.value === null
    ? currentPosition.value
    : newPosition.value * currentTrackDuration.value,
);

let trackMouseForVolume = false;
const volumeSvg = ref<HTMLElement | null>(null);
const updateVolume = (event: PointerEvent) => {
  if (!volumeSvg.value) return;
  const rect = volumeSvg.value?.getBoundingClientRect();
  const newValue = (event.clientX - rect.left) / rect.width;
  volume.value = Math.min(1, Math.max(newValue, 0));
};
const onPointerMoveVolumeBar = (event: PointerEvent) => {
  if (trackMouseForVolume) updateVolume(event);
};
const onPointerCancelVolumeBar = () => {
  trackMouseForVolume = false;
};
const onPointerDownVolumeBar = (event: PointerEvent) => {
  trackMouseForVolume = true;
  updateVolume(event);
};
const onPointerUpVolumeBar = (event: PointerEvent) => {
  trackMouseForVolume = false;
  updateVolume(event);
};
</script>

<template>
  <div>
    <div class="px-3 py-6">
      <div class="flex h-60 items-center justify-center">
        <div class="relative z-10 overflow-hidden">
          <CoverImage
            :src="currentTrack?.meta?.attachedPicture"
            class="w-40 rounded-md"
          />
        </div>
        <ProtectedImage
          v-if="currentTrack?.meta?.attachedPicture"
          :src="currentTrack?.meta?.attachedPicture"
          class="absolute top-[59px] z-0 w-[160px] blur-[80px]"
          no-border
        />
      </div>
      <div class="flex flex-col gap-1 overflow-x-hidden whitespace-nowrap py-3">
        <TextMarquee class="m-auto">
          <h3
            class="text-lg font-semibold leading-tight"
            :title="currentTrack?.title || ''"
          >
            {{ currentTrack?.title }}
          </h3>
        </TextMarquee>
        <div
          class="overflow-x-hidden whitespace-nowrap text-base leading-snug text-label-2"
        >
          <TextMarquee class="m-auto">
            <span
              v-if="currentTrack?.meta?.artist"
              :title="currentTrack?.meta?.artist"
            >
              {{ currentTrack.meta?.artist }}
            </span>
            <span
              v-if="currentTrack?.meta?.artist && currentTrack?.meta?.album"
            >
              -
            </span>
            <span
              v-if="currentTrack?.meta?.album"
              :title="currentTrack?.meta?.album"
            >
              {{ currentTrack.meta?.album }}
            </span>
          </TextMarquee>
        </div>
      </div>
      <div
        class="group/position px-4 py-2"
        @pointermove="positionOnPointerMove"
        @pointercancel="positionOnPointerCancel"
        @pointerleave="positionOnPointerCancel"
      >
        <div class="flex h-3 items-center py-2">
          <svg
            ref="positionSvg"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="width-full h-2 w-full cursor-pointer overflow-hidden rounded-full transition-all duration-200 ease-out group-hover/position:h-3"
            @pointerdown="positionOnPointerDown"
            @pointerup="positionOnPointerUp"
            @click.stop
          >
            <rect width="100%" height="100%" class="fill-background-2" />
            <rect
              v-if="
                Number.isFinite(currentOrNewPosition) &&
                Number.isFinite(currentTrackDuration)
              "
              :width="(currentOrNewPosition / currentTrackDuration) * 100 + '%'"
              height="100%"
              class="fill-label-1"
            />
          </svg>
        </div>
        <div class="flex justify-between py-0.5 text-sm">
          <span>
            <TimeDuration :duration="currentOrNewPosition"></TimeDuration
          ></span>
          <span>
            <TimeDuration
              :duration="
                Math.max(
                  Math.floor(currentTrackDuration) - currentOrNewPosition,
                  0,
                )
              "
            ></TimeDuration
          ></span>
        </div>
      </div>
      <div class="flex justify-evenly px-4 py-2">
        <button
          :class="isLoading ? 'text-label-4 ' : 'border hover:text-3xl'"
          class="flex aspect-square w-14 items-center justify-center rounded-full border-label-separator text-2xl transition-all duration-200 ease-out"
          @click.stop="rewind()"
        >
          <NuxtIcon name="icon.rewind.large" filled />
        </button>
        <button
          :class="
            !hasPrevious || isLoading
              ? 'text-label-4'
              : 'bg-background-2 hover:text-3xl'
          "
          class="flex aspect-square w-14 items-center justify-center rounded-full text-2xl transition-all duration-200 ease-out"
          @click.stop="previous()"
        >
          <NuxtIcon name="icon.previous.track.large" filled />
        </button>

        <button
          v-if="isLoading"
          class="flex aspect-square w-14 items-center justify-center rounded-full bg-background-2 text-2xl"
        >
          <NuxtIcon name="icon.loading.animation" filled />
        </button>
        <button
          v-if="!isLoading && status === MediaPlayerStatus.Playing"
          class="flex aspect-square w-14 items-center justify-center rounded-full bg-background-2 text-3xl transition-all duration-200 ease-out hover:text-4xl"
          @click.stop="pause()"
        >
          <NuxtIcon name="icon.pause.large" />
        </button>
        <button
          v-if="!isLoading && status !== MediaPlayerStatus.Playing"
          class="flex aspect-square w-14 items-center justify-center rounded-full bg-background-2 text-3xl transition-all duration-200 ease-out hover:text-4xl"
          @click.stop="play()"
        >
          <NuxtIcon name="play" />
        </button>
        <button
          :class="
            !hasNext || isLoading
              ? 'text-label-4'
              : 'bg-background-2 hover:text-3xl'
          "
          class="flex aspect-square w-14 items-center justify-center rounded-full text-2xl transition-all duration-200 ease-out"
          @click.stop="next()"
        >
          <NuxtIcon name="icon.next.track.large" filled />
        </button>

        <button
          :class="
            currentPosition >= currentTrackDuration || isLoading
              ? 'text-label-4'
              : 'border border-background-2 hover:text-3xl'
          "
          class="flex aspect-square w-14 items-center justify-center rounded-full text-2xl transition-all duration-200 ease-out"
          @click.stop="fastForward()"
        >
          <NuxtIcon name="icon.skip.large" filled />
        </button>
      </div>
      <div class="px-4 pb-2 pt-5">
        <div
          class="group/volume flex items-center gap-3 rounded-3xl border border-label-separator px-[16px] py-1.5"
          @pointermove="onPointerMoveVolumeBar"
          @pointercancel="onPointerCancelVolumeBar"
          @pointerleave="onPointerCancelVolumeBar"
        >
          <NuxtIcon
            name="icon.audio.off"
            class="cursor-pointer text-2xl"
            @click.stop="volume = 0"
          />
          <div class="flex h-3 items-center py-2">
            <svg
              ref="volumeSvg"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="width-full h-2 w-full cursor-pointer overflow-hidden rounded-full transition-all duration-200 ease-out group-hover/volume:h-3"
              @pointerup="onPointerUpVolumeBar"
              @pointerdown="onPointerDownVolumeBar"
              @click.stop
            >
              <rect width="100%" height="100%" class="fill-background-2" />
              <rect
                v-if="Number.isFinite(volume)"
                :width="volume * 100 + '%'"
                height="100%"
                class="fill-label-1"
              />
            </svg>
          </div>
          <NuxtIcon
            name="icon.audio.on"
            class="cursor-pointer text-2xl"
            @click.stop="volume = 1"
          />
        </div>
      </div>
      <div class="absolute left-4 right-4 top-4 z-10 flex justify-between">
        <div>
          <div
            class="cursor-pointer rounded-full border border-label-separator p-1.5"
            @click.stop="open = !open"
          >
            <NuxtIcon name="icon.minify" filled class="text-xl" />
          </div>
        </div>
        <div v-if="(currentTrack?.languages?.length || 0) > 1" class="text-sm">
          <TrackChangeLocale />
        </div>
        <div>
          <TrackMenu
            v-if="currentTrack"
            :track="currentTrack"
            button-class="rounded-full border border-label-separator p-1.5"
          ></TrackMenu>
        </div>
      </div>
    </div>
    <hr class="border-label-separator" />
    <div class="overflow-y-scroll">
      <div class="flex items-center justify-between px-6 pb-1 pt-4">
        <div class="text-label-3">{{ t("player.queue") }}</div>
        <div class="flex gap-2">
          <button
            class="rounded-full p-2 transition-all duration-200 ease-out hover:opacity-75"
            :class="
              queue.isShuffled
                ? 'bg-background-4 text-on-color-1'
                : 'text-label-1'
            "
            @click.stop="
              () => (queue.isShuffled ? queue.unshuffle() : queue.shuffle())
            "
          >
            <NuxtIcon name="icon.shuffle" class="text-2xl" />
          </button>
          <button
            class="rounded-full p-2 transition-all duration-200 ease-out hover:opacity-75"
            :class="
              repeatStatus ? 'bg-background-4 text-on-color-1' : 'text-label-1'
            "
            @click.stop="repeatStatus = (repeatStatus + 1) % 3"
          >
            <NuxtIcon
              v-if="repeatStatus < 2"
              name="icon.repeat"
              filled
              class="text-2xl"
            />
            <NuxtIcon
              v-else
              name="icon.repeat.single"
              filled
              class="text-2xl"
            />
          </button>
        </div>
      </div>
      <ul class="px-3 pb-3">
        <li v-for="(item, i) in queue" :key="i" @click="queue.index = i">
          <div
            :class="
              queue.index === i ? 'bg-tint text-black-1 hover:bg-tint' : ''
            "
            class="flex cursor-pointer justify-between gap-2 rounded-xl px-3 py-2 transition-all duration-500 ease-out hover:bg-background-2"
          >
            <div class="truncate">
              <div>{{ item.meta?.title || item.title }}</div>
              <div
                class="text-sm"
                :class="queue.index === i ? 'text-black-2' : 'text-label-2'"
              >
                <span v-if="item?.meta?.artist">
                  {{ item.meta?.artist }}
                </span>
                <span v-if="item?.meta?.artist && item?.meta?.album"> - </span>
                <span v-if="item?.meta?.album">
                  {{ item.meta?.album }}
                </span>
              </div>
            </div>

            <div class="flex items-center justify-between gap-2">
              <TrackMenu :track="item" />
              <NuxtIcon
                v-if="queue.index === i && status !== MediaPlayerStatus.Stopped"
                name="icon.playing.animation"
                filled
                class="text-2xl"
                :class="{
                  'animation-paused': status !== MediaPlayerStatus.Playing,
                }"
              />
            </div>
          </div>

          <hr
            v-if="!(queue.index - 1 === i || queue.index === i)"
            class="border-label-separator"
          />
        </li>
      </ul>
    </div>
  </div>
</template>
