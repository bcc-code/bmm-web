<script lang="ts" setup>
import { PodcastModel } from "@bcc-code/bmm-sdk-fetch";

defineProps<{
  podcast: PodcastModel;
}>();
</script>

<template>
  <li class="group relative mr-3 cursor-pointer py-3">
    <NuxtLink
      :to="{
        name: 'playlist-podcast-id',
        params: { id: podcast.id },
      }"
    >
      <div
        class="absolute -inset-x-4 -inset-y-0 rounded-xl bg-background-2 opacity-0 group-hover:opacity-100 dark:bg-background-dark-2"
      ></div>
      <div class="relative flex items-center justify-between gap-3">
        <div v-if="podcast.cover" class="w-10">
          <ProtectedImage
            :src="podcast.cover"
            alt=""
            class="aspect-square w-10 rounded-xl bg-background-2 dark:bg-background-dark-2"
          />
        </div>
        <div class="mr-auto w-1/3">
          <h4
            class="overflow-hidden text-ellipsis whitespace-nowrap font-semibold"
            :title="podcast.title || ''"
          >
            {{ podcast.title }}
          </h4>
        </div>
        <div class="ml-auto flex items-center justify-center gap-1">
          <button class="focus:bg-lime-400 rounded-lg px-2 py-0">
            <NuxtIcon name="icon.chevron.right" filled class="text-2xl" />
          </button>
        </div>
      </div>
    </NuxtLink>
  </li>
</template>
