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
    class="fixed bottom-4 right-4 flex w-[400px] p-3 rounded-2xl shadow-xl bg-white-1 border border-black-1/10"
  >
    <div class="flex flex-1 gap-3 min-w-0">
      <div class="flex flex-1 gap-3 min-w-0">
        <div
          class="shrink-0 rounded-md bg-background-2 h-[48px] aspect-square overflow-hidden"
        >
          <ProtectedImage
            v-if="currentTrack?.meta?.attachedPicture"
            :src="currentTrack?.meta?.attachedPicture"
          />
        </div>
        <div class="flex flex-col min-w-0">
          <h3
            class="font-semibold text-lg truncate leading-tight"
            :title="currentTrack?.title || ''"
          >
            {{ currentTrack?.title }}
          </h3>
          <span
            v-if="currentTrack?.meta?.artist"
            class="text-label-2 text-base truncate leading-snug"
            :title="currentTrack?.meta?.artist"
          >
            {{ currentTrack.meta?.artist }}
          </span>
        </div>
      </div>
      <div>
        <button v-if="status === MediaPlayerStatus.Playing" @click="pause()">
          <span class="flex aspect-square w-12 justify-center align-middle">
            <IconComponent name="icon.pause.large" class="text-3xl" />
          </span>
        </button>
        <button v-if="status !== MediaPlayerStatus.Playing" @click="play()">
          <span class="flex aspect-square w-12 justify-center align-middle">
            <IconComponent name="play" class="text-3xl" />
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
