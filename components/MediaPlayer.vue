<script setup lang="ts">
import { MediaPlayerStatus } from "~/plugins/mediaPlayer/mediaPlayer";

const open = ref(false);
const hover = ref(false);

const {
  status,
  play,
  pause,
  currentTrack,
  currentPosition,
  currentTrackDuration,
  queue,
  next,
  hasNext,
  previous,
  hasPrevious,
  rewind,
  fastForward,
} = useNuxtApp().$mediaPlayer;
</script>

<template>
  <transition
    enter-active-class="transition-all duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-2"
    leave-active-class="transition-all duration-200 ease-out"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="!open"
      class="shadow-player absolute bottom-5 right-5 flex flex-col rounded-2xl bg-white-1 p-3"
      @click.stop="open = !open"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <svg
        v-if="hover"
        class="absolute -left-1 -top-1"
        xmlns="http://www.w3.org/2000/svg"
        width="11"
        height="11"
        viewBox="0 0 11 11"
        fill="none"
      >
        <path
          d="M0 1.5C0 0.671573 0.671573 0 1.5 0H7.37868C8.71504 0 9.38429 1.61571 8.43934 2.56066L2.56066 8.43934C1.61572 9.38428 0 8.71504 0 7.37868V1.5Z"
          fill="#0D131A"
        />
      </svg>
      <div class="flex">
        <div
          class="mr-3 aspect-square h-[48px] shrink-0 overflow-hidden rounded-md bg-background-2 dark:bg-background-dark-2"
        >
          <ProtectedImage
            v-if="currentTrack?.meta?.attachedPicture"
            :src="currentTrack?.meta?.attachedPicture"
          />
        </div>
        <div class="flex min-w-0 flex-col">
          <h3
            class="truncate text-lg font-semibold leading-tight"
            :title="currentTrack?.title || ''"
          >
            {{ currentTrack?.title }}
          </h3>
          <div>
            <span
              v-if="currentTrack?.meta?.artist"
              class="truncate text-base leading-snug text-label-2 dark:text-label-dark-2"
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
              class="truncate text-base leading-snug text-label-2 dark:text-label-dark-2"
              :title="currentTrack?.meta?.album"
            >
              {{ currentTrack.meta?.album }}
            </span>
          </div>
        </div>
        <button
          v-if="status === MediaPlayerStatus.Playing"
          @click.stop="pause()"
        >
          <span class="flex aspect-square w-12 justify-center align-middle">
            <NuxtIcon
              name="icon.pause.large"
              class="text-3xl group-hover:text-4xl"
            />
          </span>
        </button>
        <button
          v-if="status !== MediaPlayerStatus.Playing"
          @click.stop="play()"
        >
          <span class="flex aspect-square w-12 justify-center align-middle">
            <NuxtIcon name="play" class="text-3xl group-hover:text-4xl" />
          </span>
        </button>
      </div>
      <svg
        width="100%"
        height="8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="width-full rounded-full overflow-hidden"
      >
        <rect width="100%" height="8" class="fill-background-2" />
        <rect
          v-if="
            Number.isFinite(currentPosition) &&
            Number.isFinite(currentTrackDuration)
          "
          :width="(currentPosition / currentTrackDuration) * 100 + '%'"
          height="8"
          class="fill-label-1"
        />
      </svg>
    </div>
  </transition>

  <transition
    enter-active-class="transition-all duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-2"
    leave-active-class="transition-all duration-200 ease-out"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="open"
      class="shadow-player h-100 absolute bottom-5 right-5 flex flex-col rounded-2xl bg-white-1 w-[400px]"
    >
      <div class="px-3 py-6">
        <div class="flex items-center justify-center h-60">
          <ProtectedImage
            v-if="currentTrack?.meta?.attachedPicture"
            :src="currentTrack?.meta?.attachedPicture"
            class="relative z-10 overflow-hidden rounded-md w-40"
          />
          <ProtectedImage
            v-if="currentTrack?.meta?.attachedPicture"
            :src="currentTrack?.meta?.attachedPicture"
            class="absolute top-[59px] z-0 w-[160px] blur-[80px]"
          />
        </div>
        <div class="flex flex-col py-3 gap-1">
          <h3
            class="truncate text-center text-lg font-semibold leading-tight"
            :title="currentTrack?.title || ''"
          >
            {{ currentTrack?.title }}
          </h3>
          <div
            class="text-center truncate text-base leading-snug text-label-2 dark:text-label-dark-2"
          >
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
          </div>
        </div>
        <div class="px-4 py-2">
          <div class="py-2">
            <svg
              width="100%"
              height="8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="width-full rounded-full overflow-hidden"
            >
              <rect width="100%" height="8" class="fill-background-2" />
              <rect
                v-if="
                  Number.isFinite(currentPosition) &&
                  Number.isFinite(currentTrackDuration)
                "
                :width="(currentPosition / currentTrackDuration) * 100 + '%'"
                height="8"
                class="fill-label-1"
              />
            </svg>
          </div>
          <div class="flex justify-between py-0.5 text-sm">
            <span>
              <TimeDuration :duration="currentPosition"></TimeDuration
            ></span>
            <span>
              <TimeDuration :duration="currentTrackDuration"></TimeDuration
            ></span>
          </div>
        </div>
        <div class="flex justify-evenly px-4 py-2">
          <button
            :class="{ 'text-label-4': currentPosition === 0 }"
            @click.stop="rewind()"
          >
            <span class="flex aspect-square w-12">
              <NuxtIcon name="icon.rewind.large" filled class="text-2xl" />
            </span>
          </button>
          <button
            :class="{ 'text-label-4': !hasPrevious }"
            @click.stop="previous()"
          >
            <span class="flex aspect-square w-12">
              <NuxtIcon
                name="icon.previous.track.large"
                filled
                class="text-2xl"
              />
            </span>
          </button>

          <button
            v-if="status === MediaPlayerStatus.Playing"
            @click.stop="pause()"
          >
            <span class="flex aspect-square w-12">
              <NuxtIcon
                name="icon.pause.large"
                class="text-3xl group-hover:text-4xl"
              />
            </span>
          </button>
          <button
            v-if="status !== MediaPlayerStatus.Playing"
            @click.stop="play()"
          >
            <span class="flex aspect-square w-12">
              <NuxtIcon name="play" class="text-3xl group-hover:text-4xl" />
            </span>
          </button>
          <button :class="{ 'text-label-4': !hasNext }" @click.stop="next()">
            <span class="flex aspect-square w-12">
              <NuxtIcon name="icon.next.track.large" filled class="text-2xl" />
            </span>
          </button>

          <button
            :class="{ 'text-label-4': currentPosition >= currentTrackDuration }"
            @click.stop="fastForward()"
          >
            <span class="flex aspect-square w-12">
              <NuxtIcon name="icon.skip.large" filled class="text-2xl" />
            </span>
          </button>
        </div>
        <div class="flex justify-between absolute z-10 top-4 left-4 right-4">
          <div
            class="rounded-full border border-label-separator p-1.5 cursor-pointer"
            @click.stop="open = !open"
          >
            <NuxtIcon name="icon.minify" filled class="text-xl" />
          </div>
          <div
            class="rounded-full border border-label-separator px-3 py-1.5 cursor-pointer text-sm"
            style="background-color: rgba(255, 0, 0, 0.4); color: red"
          >
            <!-- TODO: Implement option to change the language -->
            {{
              currentTrack?.language
                ? getLocalizedLanguageName(currentTrack.language)
                : ""
            }}
          </div>
          <div
            class="rounded-full border border-label-separator p-1.5 cursor-pointer"
            style="background-color: rgba(255, 0, 0, 0.4); color: red"
          >
            <NuxtIcon name="options" filled class="text-xl" />
          </div>
        </div>
      </div>
      <hr class="border-label-separator" />
      <div class="flex justify-between items-center pb-1 pt-4 px-6">
        <div class="text-label-3">Queue</div>
        <div class="flex gap-2">
          <button
            v-if="queue.isShuffled"
            class="rounded-full bg-background-4 p-2 text-background-3 hover:bg-background-3 hover:text-background-4 dark:bg-background-dark-4 dark:text-background-dark-3 dark:hover:bg-background-dark-3 dark:hover:text-background-dark-4"
            @click.stop="queue.unshuffle()"
          >
            <NuxtIcon name="icon.shuffle" class="text-2xl" />
          </button>
          <button
            v-else
            class="rounded-full bg-background-3 p-2 text-background-4 hover:bg-background-4 hover:text-background-3 dark:bg-background-dark-3 dark:text-background-dark-4 dark:hover:bg-background-dark-4 dark:hover:text-background-dark-3"
            @click.stop="queue.shuffle()"
          >
            <NuxtIcon name="icon.shuffle" class="text-2xl" />
          </button>
          <button
            class="rounded-full bg-background-3 p-2"
            style="background-color: rgba(255, 0, 0, 0.4); color: red"
          >
            <NuxtIcon name="icon.repeat" filled class="text-2xl" />
          </button>
        </div>
      </div>
      <ul class="overflow-y-scroll px-3 pb-3 max-h-20">
        <li v-for="(item, i) in queue" :key="i" @click="queue.index = i">
          <div
            :class="queue.index === i ? 'bg-tint' : ''"
            class="rounded-xl px-3 py-2 flex justify-between gap-2"
          >
            <div class="truncate">
              <div>{{ item.meta?.title || item.title }}</div>
              <div class="text-sm text-label-2 dark:text-label-dark-2">
                <span v-if="item?.meta?.artist">
                  {{ item.meta?.artist }}
                </span>
                <span v-if="item?.meta?.artist && item?.meta?.album"> - </span>
                <span v-if="item?.meta?.album">
                  {{ item.meta?.album }}
                </span>
              </div>
            </div>
            <NuxtIcon name="options" filled class="text-2xl" />
            <NuxtIcon
              v-if="queue.index === i"
              name="icon.playing (animation)"
              filled
              class="text-2xl"
            />
          </div>

          <hr
            v-if="!(queue.index - 1 === i || queue.index === i)"
            class="border-label-separator"
          />
        </li>
      </ul>
    </div>
  </transition>
</template>

<style scoped>
.shadow-player {
  box-shadow:
    0px 4px 12px 0px rgba(0, 0, 0, 0.05),
    0px 1px 4px 0px rgba(0, 0, 0, 0.05),
    0px 0px 0px 1px rgba(0, 0, 0, 0.05);
}
</style>
