<script setup lang="ts">
import { MediaPlayerStatus } from "~/plugins/3.mediaPlayer";

const { status, play, pause, hasNext, next, previous, hasPrevious } =
  useNuxtApp().$mediaPlayer;
const { currentTrack, queue } = useNuxtApp().$mediaPlaylist;
</script>

<template>
  <div
    class="fixed bottom-4 right-4 flex w-[400px] flex-col rounded-2xl border border-black-1/10 bg-white-1 p-3 shadow-xl dark:border-white-1/10 dark:bg-black-1"
  >
    <div class="flex min-w-0 flex-1 gap-3">
      <div class="group select-none">
        <button v-if="hasPrevious" @click.stop="previous()">
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
      </div>
      <div class="group select-none">
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
      <div class="group select-none">
        <button v-if="hasNext" @click.stop="next()">
          <span class="flex aspect-square w-12 justify-center align-middle">
            <NuxtIcon
              name="icon.next.track.large"
              class="text-3xl group-hover:text-4xl"
            />
          </span>
        </button>
      </div>
    </div>
    <ul class="max-h-20 overflow-y-scroll">
      <li v-for="(item, i) in queue" :key="i">
        {{ item.meta?.title || item.title }}
      </li>
    </ul>
  </div>
</template>
