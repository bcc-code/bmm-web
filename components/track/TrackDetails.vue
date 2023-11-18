<script setup lang="ts">
import { TrackModel } from "@bcc-code/bmm-sdk-fetch";

defineProps<{
  track: TrackModel;
}>();
</script>

<template>
  <div class="py-4 text-lg">
    {{ track.title }}
  </div>
  <div class="py-4 text-lg"><b>Album:</b> {{ track.meta?.album }}</div>
  <div class="py-4 text-lg">
    <b>Duration:</b>
    <TimeDuration
      :duration="((track.media || [])[0]?.files || [])[0]?.duration || 0"
    ></TimeDuration>
  </div>
</template>
