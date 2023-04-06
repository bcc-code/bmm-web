<script lang="ts" setup>
import { TrackModel } from "@bcc-code/bmm-sdk-fetch";

const props = defineProps<{
  track: TrackModel;
}>();
</script>

<template>
  <div class="py-3 px-4 rounded-lg hover:bg-slate-100">
    <h4 class="font-semibold">{{ track.meta?.title }}</h4>
    <span>{{ track.meta?.artist }}</span>
  </div>
</template>
