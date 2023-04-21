<script setup lang="ts">
import {
  MediaPlayerInjectionKey,
  MediaPlaylistInjectionKey,
  MediaPlayerStatus,
} from "~/plugins/mediaPlayer";

const { status, play, pause } = inject(MediaPlayerInjectionKey)!;
const { currentSong } = inject(MediaPlaylistInjectionKey)!;
</script>
<template>
  <a href="">⏪</a>
  <a v-if="status !== MediaPlayerStatus.Playing" @click="play()">⏵</a>
  <a v-if="status === MediaPlayerStatus.Playing" @click="pause()">⏸</a>
  <a href="">⏩</a>

  <a href="">🔀</a>
  <a href="">🔁</a>

  <span style="max-width: 100px; overflow: hidden; display: inline-block"
    >Current track: {{ currentSong }}</span
  >
</template>
