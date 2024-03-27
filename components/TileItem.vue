<script lang="ts" setup>
import type { TileModel } from "@bcc-code/bmm-sdk-fetch";

defineProps<{
  item: TileModel;
}>();

const emit = defineEmits<{ "play-track": [] }>();

function playTrack() {
  emit("play-track");
}

const { locale } = useI18n();
const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  };
  return new Intl.DateTimeFormat(locale.value, options).format(dateToUtc(date));
};
const weekDay = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    timeZone: "UTC",
  };
  return new Intl.DateTimeFormat(locale.value, options).format(dateToUtc(date));
};
</script>

<template>
  <div
    v-if="item.showAllLink && item.track && item.title"
    class="bg- flex h-[200px] w-[400px] flex-row rounded-2xl"
  >
    <NuxtLink
      :to="parseLink(item.showAllLink)"
      class="aspect-square w-1/2 rounded-l-2xl"
    >
      <CoverImage
        :src="item.coverUrl"
        :alt="item.title"
        class="rounded-l-2xl"
        no-border
      />
    </NuxtLink>
    <div
      class="flex w-1/2 cursor-pointer flex-col rounded-r-2xl p-6 text-black-1"
      :style="'background: ' + (item.backgroundColor ?? '#F5F6F7')"
      @click.stop="playTrack"
    >
      <div class="opacity-70">{{ item.title }}</div>
      <div class="text-lg font-semibold">{{ item.label }}</div>
      <div v-if="item.date" class="whitespace-nowrap text-sm">
        {{ weekDay(item.date) }}
        <span class="opacity-70">{{ formatDate(item.date) }}</span>
      </div>
      <div v-else class="text-sm">
        {{ item.subtitle }}
      </div>
      <div class="mt-auto flex w-full flex-row">
        <button
          class="h-10 w-10 rounded-full bg-black-1"
          @click.stop="playTrack"
        >
          <NuxtIcon name="icon.play" class="p-2 text-2xl text-white-1" />
        </button>
        <TrackMenu :track="item.track" class="ml-auto"></TrackMenu>
      </div>
    </div>
  </div>
</template>
