<script setup lang="ts">
import { MediaPlayerStatus } from "~/plugins/mediaPlayer/mediaPlayer";

const { status, play, pause, next, previous, open } = useNuxtApp().$mediaPlayer;

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

function setOpen(value: boolean) {
  if ("startViewTransition" in document && document.startViewTransition) {
    document.startViewTransition(() => {
      open.value = value;
    });
  } else {
    open.value = value;
  }
}
</script>

<template>
  <div
    class="shrink-0 transition-[width] duration-700 ease-out-expo"
    :class="{ 'w-[400px]': open, 'w-0': !open }"
  >
    <div
      :class="[
        'large-shadow group fixed bottom-1 right-0 z-30 flex w-[400px] max-w-full animate-[player-enter_200ms] flex-col overflow-hidden bg-background-1 transition-all duration-700 ease-out-expo sm:bottom-5 sm:right-5',
        {
          'rounded-[32px]': open,
          'rounded-2xl': !open,
        },
      ]"
      :style="{
        height: open ? 'calc(100vh - 6rem)' : '4.5rem',
        'animation-timing-function': 'cubic-bezier(0.19, 1, 0.22, 1)',
      }"
    >
      <MediaPlayerClosed v-if="!open" @click.stop="setOpen(!open)" />
      <MediaPlayerOpen
        v-else
        :model-value="open"
        @update:model-value="setOpen"
        class="player-height"
      />
    </div>
  </div>
</template>
