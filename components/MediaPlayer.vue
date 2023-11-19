<script setup lang="ts">
import { MediaPlayerStatus } from "~/plugins/mediaPlayer/mediaPlayer";

const {
  status,
  play,
  pause,
  hasNext,
  next,
  previous,
  hasPrevious,
  rewind,
  fastForward,
  currentTrack,
  currentPosition,
  currentTrackDuration,
  isLoading,
  queue,
} = useNuxtApp().$mediaPlayer;
</script>

<template>
  <div
    class="fixed bottom-4 right-4 flex w-[400px] flex-col rounded-2xl border border-black-1/10 bg-white-1 p-3 shadow-xl dark:border-white-1/10 dark:bg-black-1"
  >
    <div class="flex min-w-0 flex-1 gap-3">
      <div class="group select-none">
        <button @click.stop="rewind()">
          <span class="flex aspect-square w-12 justify-center align-middle">
            <NuxtIcon
              name="icon.rewind.large"
              class="text-3xl group-hover:text-4xl"
            />
          </span>
        </button>
      </div>
      <div v-if="hasPrevious" class="group select-none">
        <button @click.stop="previous()">
          <span class="flex aspect-square w-12 justify-center align-middle">
            <NuxtIcon
              name="icon.previous.track.large"
              class="text-3xl group-hover:text-4xl"
            />
          </span>
        </button>
      </div>
      <div class="flex min-w-0 flex-1 gap-3">
        <div
          class="aspect-square h-[48px] shrink-0 overflow-hidden rounded-md bg-background-2"
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
          <span
            v-if="currentTrack?.meta?.artist"
            class="truncate text-base leading-snug text-label-2"
            :title="currentTrack?.meta?.artist"
          >
            {{ currentTrack.meta?.artist }}
          </span>
        </div>
      </div>
      <div class="group relative select-none">
        <div
          v-if="isLoading"
          role="status"
          class="absolute -z-10 flex h-full w-full justify-center fill-background-4 align-middle"
        >
          <svg
            aria-hidden="true"
            class="flex aspect-square w-6 animate-spin justify-center align-middle"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              class="opacity-20"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
            />
          </svg>
          <span class="sr-only">Loading...</span>
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
      <div v-if="hasNext" class="group select-none">
        <button @click.stop="next()">
          <span class="flex aspect-square w-12 justify-center align-middle">
            <NuxtIcon
              name="icon.next.track.large"
              class="text-3xl group-hover:text-4xl"
            />
          </span>
        </button>
      </div>
      <div class="group select-none">
        <button @click.stop="fastForward()">
          <span class="flex aspect-square w-12 justify-center align-middle">
            <NuxtIcon
              name="icon.skip.large"
              class="text-3xl group-hover:text-4xl"
            />
          </span>
        </button>
      </div>
    </div>
    <input
      v-model="currentPosition"
      type="range"
      :min="0"
      :max="currentTrackDuration"
    />
    <TimeDuration :duration="currentPosition"></TimeDuration>
    | <TimeDuration :duration="currentTrackDuration"></TimeDuration>
    <div>
      <button
        v-if="queue.isShuffled"
        class="rounded-full bg-background-4 px-2 py-2 text-background-3 hover:bg-background-3 hover:text-background-4"
        @click.stop="queue.unshuffle()"
      >
        <NuxtIcon name="icon.shuffle" class="text-2xl" />
      </button>
      <button
        v-else
        class="rounded-full bg-background-3 px-2 py-2 text-background-4 hover:bg-background-4 hover:text-background-3"
        @click.stop="queue.shuffle()"
      >
        <NuxtIcon name="icon.shuffle" class="text-2xl" />
      </button>
    </div>

    <ul class="max-h-20 overflow-y-scroll">
      <li
        v-for="(item, i) in queue"
        :key="i"
        :class="queue.index === i ? 'bg-tint' : ''"
        @click="queue.index = i"
      >
        {{ item.meta?.title || item.title }}
      </li>
    </ul>
  </div>
</template>
