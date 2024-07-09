<script lang="ts" setup>
import { PodcastApi } from "@bcc-code/bmm-sdk-fetch";
import type { TileModel } from "@bcc-code/bmm-sdk-fetch";

const props = defineProps<{
  item: TileModel;
}>();

const { setQueue } = useNuxtApp().$mediaPlayer;
const origin = "Tile";

function playTrack() {
  if (!props.item.track) return;
  if (props.item.lastPositionInMs)
    setQueue([props.item.track], 0, origin, props.item.lastPositionInMs / 1000);
  else setQueue([props.item.track], 0, origin);
  // ToDo: load linked album (from showAllLink) and add remaining items to the queue
}

async function shufflePodcast() {
  if (props.item.shufflePodcastId) {
    const tracks = await new PodcastApi().podcastIdShuffleGet({
      id: props.item.shufflePodcastId,
    });
    setQueue(tracks, 0, origin);
  }
}
</script>

<template>
  <div
    v-if="item.showAllLink && item.track && item.title"
    class="flex w-full flex-col gap-4 rounded-2xl p-4 lg:aspect-[2/1] lg:flex-row lg:gap-0 lg:p-0"
    :style="'background: ' + (item.backgroundColor ?? '#F5F6F7')"
  >
    <NuxtLink
      :to="parseLink(item.showAllLink)"
      class="aspect-square w-[120px] rounded-2xl bg-background-1 lg:w-1/2 lg:rounded-none lg:rounded-l-2xl"
    >
      <CoverImage
        :src="item.coverUrl"
        :alt="item.title"
        class="rounded-2xl lg:rounded-none lg:rounded-l-2xl"
        no-border
      />
    </NuxtLink>
    <div
      class="flex grow cursor-pointer flex-col gap-0.5 rounded-r-2xl p-0 text-black-1 lg:w-1/2 lg:p-4"
      :style="'background: ' + (item.backgroundColor ?? '#F5F6F7')"
      @click.stop="playTrack"
    >
      <div class="truncate leading-5 opacity-70">{{ item.title }}</div>
      <div
        class="max-h-[40px] overflow-hidden text-[16px] font-semibold leading-5 xl:max-h-[48px] xl:text-lg xl:leading-6"
      >
        {{ item.label }}
      </div>
      <div v-if="item.date" class="whitespace-nowrap text-sm">
        {{ weekDay(item.date) }}
        <span class="opacity-70">{{ formatDate(item.date) }}</span>
      </div>
      <div v-else class="text-sm">
        {{ item.subtitle }}
      </div>
      <div class="mt-auto flex w-full flex-row items-center gap-3.5 pt-1.5">
        <button
          class="h-10 w-10 rounded-full bg-black-1"
          @click.stop="playTrack"
        >
          <NuxtIcon name="icon.play" class="p-2 text-2xl text-white-1" />
        </button>
        <button
          v-if="item.shufflePodcastId"
          class="h-10 w-10 rounded-full border-[1px] border-label-separator"
          @click.stop="shufflePodcast"
        >
          <NuxtIcon
            name="icon.shuffle"
            class="aspect-square p-1 text-xl text-black-1"
          />
        </button>
        <TrackMenu :track="item.track" class="ml-auto" :origin="origin" />
      </div>
    </div>
  </div>
</template>
