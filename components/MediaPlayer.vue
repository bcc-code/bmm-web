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
  <div class="fixed bottom-3 right-3 w-[316px] height-5">
    <a href="">⏪</a>
    <a v-if="status !== MediaPlayerStatus.Playing" @click="play()">⏵</a>
    <a v-if="status === MediaPlayerStatus.Playing" @click="pause()">⏸</a>
    <a href="">⏩</a>

    <a href="">🔀</a>
    <a href="">🔁</a>

  <span style="max-width: 100px; overflow: hidden; display: inline-block"
    >Current track: {{ currentTrack }}</span
  >
</template>
