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
    class="fixed bottom-3 right-3 flex w-[400px] p-3 rounded-2xl shadow-xl bg-white"
  >
    <div class="flex flex-1 gap-3 min-w-0">
      <div class="flex flex-1 gap-3 min-w-0">
        <div class="shrink-0 rounded-xl bg-slate-100 w-[48px] overflow-hidden">
          <ProtectedImage
            v-if="currentTrack?.meta?.attachedPicture"
            :src="currentTrack?.meta?.attachedPicture"
          />
        </div>
        <div class="flex flex-col min-w-0">
          <h3 class="font-semibold text-lg truncate">
            {{ currentTrack?.title }}
          </h3>
          <span
            class="text-slate-700 text-base truncate"
            v-if="currentTrack?.meta?.artist"
          >
            {{ currentTrack.meta?.artist }}
          </span>
        </div>
      </div>
      <div>
        <a v-if="status === MediaPlayerStatus.Playing" @click="pause()">
          <span class="flex aspect-square w-[48px] justify-center align-middle">
            <IconComponent name="icon.pause.large" class="text-3xl" />
          </span>
        </a>
        <a v-if="status !== MediaPlayerStatus.Playing" @click="play()">
          <span class="flex aspect-square w-[48px] justify-center align-middle">
            <IconComponent name="play" class="text-3xl" />
          </span>
        </a>
      </div>
    </div>
  </div>
</template>
