<script setup lang="ts">
import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";

defineProps<{
  track: TrackModel;
}>();
</script>

<template>
  <div class="rounded-lg bg-background-2">
    <div v-for="(contributor, index) in track.contributors" :key="index">
      <NuxtLink
        class="flow-row flex gap-3 rounded-lg p-2 px-5 text-label-1 hover:bg-label-separator"
        :to="{
          name: 'playlist-contributor-id',
          params: { id: contributor.id ?? 0 },
        }"
      >
        {{ contributor.name }}
      </NuxtLink>
    </div>
  </div>
</template>
