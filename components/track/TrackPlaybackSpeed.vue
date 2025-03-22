<script setup lang="ts">
import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";

const { playbackSpeed } = useNuxtApp().$mediaPlayer;
const { t } = useI18n();

defineProps<{
  track: TrackModel;
}>();

const speeds = [
  { value: 0.25, label: "0.25x" },
  { value: 0.5, label: "0.5x" },
  { value: 0.75, label: "0.75x" },
  { value: 1, label: t("track.playback.normal") },
  { value: 1.25, label: "1.25x" },
  { value: 1.5, label: "1.5x" },
  { value: 2, label: "2x" },
];

const dropdownMenuItems = computed(() =>
  speeds.map((speed) => ({
    text: speed.label,
    clickFunction: () => {
      playbackSpeed.value = speed.value;
    },
    current: playbackSpeed.value === speed.value,
  })),
);
</script>

<template>
  <DropdownMenu v-bind="$attrs">
    <DropdownMenuItem
      v-for="item in dropdownMenuItems"
      :key="item.text"
      :remove-flex="true"
      class="py-5"
      @click="item.clickFunction()"
    >
      <div class="flex items-center gap-2">
        {{ item.text }}
        <NuxtIcon v-if="item.current" name="icon.selected" class="text-2xl" />
      </div>
    </DropdownMenuItem>
  </DropdownMenu>
</template>
