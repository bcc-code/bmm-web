<script setup lang="ts">
import { MediaPlayerStatus } from "~/plugins/mediaPlayer/mediaPlayer";

const open = ref(false);

const {
  status,
  play,
  pause,
  currentTrack,
  currentPosition,
  currentTrackDuration,
  queue,
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
      class="absolute bottom-5 right-5 flex flex-col bg-white-1"
      v-if="!open"
      @click.stop="open = !open"
    >
      <div class="flex">
        <div
          class="aspect-square h-[48px] shrink-0 overflow-hidden rounded-md bg-background-2 dark:bg-background-dark-2"
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
            class="truncate text-base leading-snug text-label-2 dark:text-label-dark-2"
            :title="currentTrack?.meta?.artist"
          >
            {{ currentTrack.meta?.artist }}
          </span>
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
      <input
        v-model="currentPosition"
        type="range"
        :min="0"
        :max="currentTrackDuration"
      />
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
      class="h-100 absolute bottom-5 right-5 flex flex-col bg-white-1"
      @click.stop="open = !open"
    >
      <div class="flex justify-between">
        <NuxtIcon name="icon.minify" filled class="text-2xl" />
        <div>(LANGUAGE)</div>
        <NuxtIcon name="options" filled class="text-2xl" />
      </div>
      <div
        class="aspect-square h-[48px] shrink-0 overflow-hidden rounded-md bg-background-2 dark:bg-background-dark-2"
      >
        <ProtectedImage
          v-if="currentTrack?.meta?.attachedPicture"
          :src="currentTrack?.meta?.attachedPicture"
        />
      </div>
      <div class="flex min-w-0 flex-col">
        <h3
          class="truncate text-center text-lg font-semibold leading-tight"
          :title="currentTrack?.title || ''"
        >
          {{ currentTrack?.title }}
        </h3>
        <span
          v-if="currentTrack?.meta?.artist"
          class="truncate text-center text-base leading-snug text-label-2 dark:text-label-dark-2"
          :title="currentTrack?.meta?.artist"
        >
          {{ currentTrack.meta?.artist }}
        </span>
      </div>
      <input
        v-model="currentPosition"
        type="range"
        :min="0"
        :max="currentTrackDuration"
      />
      <div class="flex justify-between">
        <span> <TimeDuration :duration="currentPosition"></TimeDuration></span>
        <span>
          <TimeDuration :duration="currentTrackDuration"></TimeDuration
        ></span>
      </div>
      <div class="flex justify-evenly">
        <NuxtIcon name="icon.rewind.large" filled class="text-2xl" />
        <NuxtIcon name="icon.previous.track.large" filled class="text-2xl" />
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
        <NuxtIcon name="icon.next.track.large" filled class="text-2xl" />
        <NuxtIcon name="icon.skip.large" filled class="text-2xl" />
      </div>
      <hr />
      <div class="flex justify-between">
        <div>queue</div>
        <div class="flex">
          <NuxtIcon name="icon.shuffle" filled class="text-2xl" />
          <NuxtIcon name="icon.repeat" filled class="text-2xl" />
        </div>
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
  </transition>
</template>
