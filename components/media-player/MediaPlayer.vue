<script setup lang="ts">
import { MediaPlayerStatus } from "~/plugins/mediaPlayer/mediaPlayer";

const open = ref(false);

const { status, play, pause, next, previous } = useNuxtApp().$mediaPlayer;

defineShortcuts({
  " ": {
    handler: () => {
      if (status.value !== MediaPlayerStatus.Playing) play();
      else pause();
    },
  },
  ctrl_arrowleft: () => previous(), // on mac this shortcut is used to switch between spaces
  ctrl_shift_arrowleft: () => previous(),
  ctrl_arrowright: () => next(),
  ctrl_shift_arrowright: () => next(),
});
</script>

<template>
  <div class="shrink-0" :class="{ 'w-[400px]': open }">
    <div
      class="large-shadow group fixed bottom-1 right-0 z-30 flex w-[400px] max-w-full flex-col overflow-hidden rounded-2xl bg-background-1 transition-all duration-700 ease-out-expo sm:bottom-5 sm:right-5"
      :style="{
        height: open ? 'calc(100vh - 6rem)' : '4.5rem',
      }"
    >
      <MediaPlayerClosed v-if="!open" @click.stop="open = !open" />
      <MediaPlayerOpen v-else v-model="open" class="player-height" />
    </div>
  </div>
</template>
