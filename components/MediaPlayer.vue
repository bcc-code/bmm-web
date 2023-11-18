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
  previous,
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
      class="shadow-player absolute bottom-5 right-5 flex flex-col rounded-2xl bg-white-1 p-3"
      v-if="!open"
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
        height="28"
        viewBox="0 0 100% 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="width-full"
      >
        <rect y="10" width="100%" height="8" rx="4" fill="#F5F6F7" />
        <rect
          :width="(currentPosition / currentTrackDuration) * 100 + '%'"
          height="8"
          transform="translate(0 10)"
          fill="#0D131A"
          rx="4"
        />
        <rect
          v-if="(currentPosition / currentTrackDuration) * 100 > 0.95"
          :width="(currentPosition / currentTrackDuration) * 105 + '%'"
          height="8"
          transform="translate(1.8 10)"
          fill="#0D131A"
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
      class="shadow-player h-100 absolute bottom-5 right-5 flex flex-col overflow-auto rounded-2xl bg-white-1 p-4 pb-0"
    >
      <div class="flex justify-between pb-[17px]">
        <div class="rounded-2xl border" @click.stop="open = !open">
          <NuxtIcon name="icon.minify" filled class="text-2xl" />
        </div>
        <div class="rounded-2xl border">{{ currentTrack?.language }}</div>
        <div class="rounded-2xl border">
          <NuxtIcon name="options" filled class="text-2xl" />
        </div>
      </div>
      <div class="flex justify-around pb-12">
        <div
          class="aspect-square w-40 overflow-hidden rounded-md bg-background-2 dark:bg-background-dark-2"
        >
          <ProtectedImage
            v-if="currentTrack?.meta?.attachedPicture"
            :src="currentTrack?.meta?.attachedPicture"
            class="relative z-10"
          />
          <ProtectedImage
            v-if="currentTrack?.meta?.attachedPicture"
            :src="currentTrack?.meta?.attachedPicture"
            class="absolute top-[59px] z-0 w-[160px] blur-[80px]"
          />
        </div>
      </div>
      <div class="flex min-w-0 flex-col pb-7">
        <h3
          class="truncate text-center text-lg font-semibold leading-tight"
          :title="currentTrack?.title || ''"
        >
          {{ currentTrack?.title }}
        </h3>
        <div class="text-center">
          <span
            v-if="currentTrack?.meta?.artist"
            class="truncate text-base leading-snug text-label-2 dark:text-label-dark-2"
            :title="currentTrack?.meta?.artist"
          >
            {{ currentTrack.meta?.artist }}
          </span>
          <span v-if="currentTrack?.meta?.artist && currentTrack?.meta?.album">
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
      <svg
        width="100%"
        height="28"
        viewBox="0 0 100% 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="width-full"
      >
        <rect y="10" width="100%" height="8" rx="4" fill="#F5F6F7" />
        <rect
          :width="(currentPosition / currentTrackDuration) * 100 + '%'"
          height="8"
          transform="translate(0 10)"
          fill="#0D131A"
          rx="4"
        />
        <rect
          v-if="(currentPosition / currentTrackDuration) * 100 > 0.95"
          :width="(currentPosition / currentTrackDuration) * 105 + '%'"
          height="8"
          transform="translate(1.8 10)"
          fill="#0D131A"
        />
      </svg>
      <div class="flex justify-between">
        <span> <TimeDuration :duration="currentPosition"></TimeDuration></span>
        <span>
          <TimeDuration :duration="currentTrackDuration"></TimeDuration
        ></span>
      </div>
      <div class="flex justify-evenly pb-6">
        <button @click.stop="rewind()">
          <span class="flex aspect-square w-12 justify-center align-middle">
            <NuxtIcon name="icon.rewind.large" filled class="text-2xl" />
          </span>
        </button>
        <button @click.stop="previous()">
          <span class="flex aspect-square w-12 justify-center align-middle">
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
        <button @click.stop="next()">
          <span class="flex aspect-square w-12 justify-center align-middle">
            <NuxtIcon name="icon.next.track.large" filled class="text-2xl" />
          </span>
        </button>

        <button @click.stop="fastForward()">
          <span class="flex aspect-square w-12 justify-center align-middle">
            <NuxtIcon name="icon.skip.large" filled class="text-2xl" />
          </span>
        </button>
      </div>
      <hr
        class="absolute left-0 right-0 top-[450px] border-label-separator pb-4"
      />
      <!-- add forward function -->
      <div class="flex justify-between pb-3">
        <div class="text-label-3">queue</div>
        <div class="flex gap-2">
          <NuxtIcon name="icon.shuffle" filled class="text-2xl" />
          <NuxtIcon name="icon.repeat" filled class="text-2xl" />
        </div>
      </div>
      <ul class="scrollbar-hide max-h-20 overflow-y-scroll">
        <li
          v-for="(item, i) in queue"
          :key="i"
          :class="queue.index === i ? 'bg-tint' : ''"
          @click="queue.index = i"
          class="rounded-xl"
        >
          <div class="flex justify-between p-1">
            <div class="titles">
              <div>{{ item.meta?.title || item.title }}</div>
              <div class="text-sm">
                <span
                  v-if="item?.meta?.artist"
                  class="truncate leading-snug text-label-2 dark:text-label-dark-2"
                  :title="item?.meta?.artist"
                >
                  {{ item.meta?.artist }}
                </span>
                <span v-if="item?.meta?.artist && item?.meta?.album"> - </span>
                <span
                  v-if="item?.meta?.album"
                  class="truncate leading-snug text-label-2 dark:text-label-dark-2"
                  :title="item?.meta?.album"
                >
                  {{ item.meta?.album }}
                </span>
              </div>
            </div>
            <div class="icons flex gap-2">
              <NuxtIcon name="options" filled class="text-2xl" />
              <NuxtIcon
                v-if="queue.index === i"
                name="icon.playing (animation)"
                filled
                class="text-2xl"
              />
            </div>
          </div>

          <hr
            v-if="!(queue.index - i === 1 || queue.index - i === 0)"
            class="border-label-separator"
          />
        </li>
      </ul>
    </div>
  </transition>
</template>
<style>
.shadow-player {
  box-shadow:
    0px 4px 12px 0px rgba(0, 0, 0, 0.05),
    0px 1px 4px 0px rgba(0, 0, 0, 0.05),
    0px 0px 0px 1px rgba(0, 0, 0, 0.05);
}

/* For Webkit-based browsers (Chrome, Safari and Opera) */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* For IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
