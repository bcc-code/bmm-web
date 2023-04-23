<script setup lang="ts">
import {
  MediaPlayerInjectionKey,
  MediaPlaylistInjectionKey,
  MediaPlayerStatus,
} from "~/plugins/3.mediaPlayer";

const { status, play, pause } = inject(MediaPlayerInjectionKey)!;
const { currentSong } = inject(MediaPlaylistInjectionKey)!;
</script>
<template>
  <div class="fixed bottom-3 right-3 w-[316px] height-5">
    <button class="p-1 bg-slate-100 hover:bg-slate-200">
      <IconComponent name="icon.previous.track.large" />
    </button>
    <button
      class="p-1 bg-slate-100 hover:bg-slate-200"
      v-if="status !== MediaPlayerStatus.Playing"
      @click="play()"
    >
      <IconComponent name="icon.play.small" />
    </button>
    <button
      class="p-1 bg-slate-100 hover:bg-slate-200"
      v-if="status === MediaPlayerStatus.Playing"
      @click="pause()"
    >
      <IconComponent name="icon.pause.small" />
    </button>
    <button class="p-1 bg-slate-100 hover:bg-slate-200">
      <IconComponent name="icon.next.track.large" />
    </button>

    <button class="p-1 bg-slate-100 hover:bg-slate-200">
      <IconComponent name="icon.shuffle" />
    </button>
    <button class="p-1 bg-slate-100 hover:bg-slate-200">
      <IconComponent name="icon.repeat" />
    </button>

    <span style="max-width: 100px; overflow: hidden; display: inline-block"
      >Current track: {{ currentSong }}</span
    >
  </div>
</template>
