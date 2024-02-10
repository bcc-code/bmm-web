<script setup lang="ts">
import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";

defineProps<{
  track: TrackModel;
}>();
</script>

<template>
  <div class="bg-background-2 rounded-lg">
    <div v-for="(contributor, index) in track.contributors" :key="index">
      <NuxtLink
        class="rounded-lg text-label-1 flex flow-row gap-3 p-2 px-5 hover:bg-label-separator"
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
