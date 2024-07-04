<script setup lang="ts">
import { MediaPlayerStatus } from "~/plugins/mediaPlayer/mediaPlayer";
import { useDraggable } from "vue-draggable-plus";
import { UAParser } from "ua-parser-js";

const { t } = useI18n();

const { device } = UAParser(navigator.userAgent);

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
} = useNuxtApp().$mediaPlayer;

function isCurrentTrack(index: number) {
  return queue.value.index === index;
}

const queueListElement = ref<HTMLUListElement>();

const disableDraggable = device.type === "mobile";
useDraggable(queueListElement, queue, {
  animation: 200,
  disabled: disableDraggable,
  onSort({ oldIndex, newIndex }) {
    if (oldIndex === undefined || newIndex === undefined) return;

    queue.value.moveTrack(oldIndex, newIndex);
  },
});
</script>

<template>
  <div class="flex max-h-full flex-col">
    <div class="px-3 py-6">
      <div
        class="mt-8 flex items-center justify-center tall:h-24 x-tall:mt-0 x-tall:h-60"
      >
        <div class="relative z-10 hidden overflow-hidden tall:block">
          <CoverImage
            :src="currentTrack?.meta?.attachedPicture"
            class="w-20 rounded-md x-tall:w-40"
          />
        </div>

        <!-- translate3d is needed to fix flickering in Safari: https://graffino.com/til/how-to-fix-filter-blur-performance-issue-in-safari -->
        <ProtectedImage
          v-if="currentTrack?.meta?.attachedPicture"
          :src="currentTrack?.meta?.attachedPicture"
          class="absolute z-0 w-[160px] blur-[80px]"
          style="transform: translate3d(0, 0, 0)"
          no-border
        />
      </div>
      <div class="flex flex-col gap-1 overflow-x-hidden whitespace-nowrap py-3">
        <TextMarquee class="m-auto">
          <h3
            v-if="currentTrack"
            class="text-lg font-semibold leading-tight"
            :title="trackTitleField(currentTrack)"
          >
            {{ trackTitleField(currentTrack) }}
          </h3>
        </TextMarquee>
        <div
          class="overflow-x-hidden whitespace-nowrap text-base leading-snug text-label-2"
        >
          <TextMarquee class="m-auto">
            <span v-if="currentTrack" :title="trackSubtitleField(currentTrack)">
              {{ trackSubtitleField(currentTrack) }}
            </span>
          </TextMarquee>
        </div>
      </div>

      <MediaPlayerPositionSlider />

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

      <MediaPlayerVolumeSlider />

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
      <ul ref="queueListElement" class="px-3 pb-3">
        <li
          v-for="(item, i) in queue"
          :key="item.track.id"
          @click="queue.index = i"
        >
          <div
            :class="{
              'bg-tint text-black-1 hover:bg-tint': isCurrentTrack(i),
              'cursor-pointer': disableDraggable,
              'cursor-row-resize': !disableDraggable,
            }"
            class="flex cursor-row-resize justify-between gap-2 rounded-xl px-3 py-2 transition-all duration-500 ease-out hover:bg-background-2"
          >
            <div class="truncate">
              <div>{{ trackTitleField(item.track) }}</div>
              <div
                class="text-sm"
                :class="isCurrentTrack(i) ? 'text-black-2' : 'text-label-2'"
              >
                <span>
                  {{ trackSubtitleField(item.track) }}
                </span>
              </div>
            </div>

            <div class="flex items-center justify-between gap-2">
              <TrackMenu :track="item.track" :origin="item.originView" />
              <NuxtIcon
                v-if="isCurrentTrack(i) && status !== MediaPlayerStatus.Stopped"
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
            v-if="!(queue.index - 1 === i || isCurrentTrack(i))"
            class="border-label-separator"
          />
        </li>
      </ul>
    </div>
  </div>
</template>
