<script lang="ts" setup>
import { defineProps } from "vue";
import ProtectedImage from "./ProtectedImage.vue";

const props = defineProps<{
  src: string;
  numberTrack: number;
  titleTrack: string;
  artistTrack: string;
  subtypeTrack: string;
}>();
</script>

<template>
  <div class="grid gap-4 grid-cols-3">
    <div class="flex flex-row m-2">
      <ProtectedImage
        :src="props.src"
        class="h-10 aspect-square rounded grid content-center"
      />
      <span class="pl-3">
        <span class="font-medium text-black text-{17px}">
          {{ props.numberTrack }}. {{ props.titleTrack }}
        </span>
        <br />
        <span class="text-sm text-{15px} text-{gray}">
          {{ props.artistTrack }}
        </span>
      </span>
    </div>
    <span class="grid content-center">{{ props.subtypeTrack }}</span>
    <div class="grid content-center">...</div>
  </div>
</template>
