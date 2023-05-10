<script setup lang="ts">
import {
  MediaPlayerInjectionKey,
  MediaPlaylistInjectionKey,
  MediaPlayerStatus,
} from "~/plugins/3.mediaPlayer";

const { status, play, pause } = inject(MediaPlayerInjectionKey)!;
const { currentTrack } = inject(MediaPlaylistInjectionKey)!;
</script>

<template>
  <div
    class="fixed bottom-4 right-4 flex w-[400px] rounded-2xl border border-black-1/10 bg-white-1 p-3 shadow-xl"
  >
    <div class="flex min-w-0 flex-1 gap-3">
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
      <div class="group select-none">
        <button v-if="status === MediaPlayerStatus.Playing" @click="pause()">
          <span class="flex aspect-square w-12 justify-center align-middle">
            <IconComponent
              name="icon.pause.large"
              class="text-3xl group-hover:text-4xl"
            />
          </span>
        </button>
        <button v-if="status !== MediaPlayerStatus.Playing" @click="play()">
          <span class="flex aspect-square w-12 justify-center align-middle">
            <IconComponent name="play" class="text-3xl group-hover:text-4xl" />
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
