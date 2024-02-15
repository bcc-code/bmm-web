<script lang="ts" setup>
import type { PodcastModel } from "@bcc-code/bmm-sdk-fetch";

defineProps<{
  podcast: PodcastModel;
}>();
</script>

<template>
  <li
    class="group grid col-span-full relative grid-cols-subgrid cursor-pointer gap-3 py-3"
  >
    <NuxtLink
      class="grid col-span-full grid-cols-subgrid"
      :to="{
        name: 'playlist-podcast-id',
        params: { id: podcast.id },
      }"
    >
      <div
        class="absolute -inset-x-4 -inset-y-0 rounded-xl bg-background-2 opacity-0 group-hover:opacity-100"
      ></div>
      <div class="relative grid col-span-full grid-cols-subgrid">
        <div class="aspect-square w-10">
          <ProtectedImage
            v-if="podcast.cover"
            :src="podcast.cover"
            class="rounded-xl bg-background-2"
          />
        </div>
        <div class="col-span-3 flex items-center">
          <h4
            class="overflow-hidden text-ellipsis whitespace-nowrap font-semibold"
            :title="podcast.title || ''"
          >
            {{ podcast.title }}
          </h4>
        </div>
        <div class="flex justify-end">
          <button class="px-2">
            <NuxtIcon name="icon.chevron.right" class="text-2xl" />
          </button>
        </div>
      </div>
    </NuxtLink>
  </li>
</template>
