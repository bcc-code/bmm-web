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
    class="flex w-full max-w-[480px] flex-col gap-4 rounded-2xl p-4 md:aspect-[2/1] md:flex-row md:gap-0 md:p-0"
    :style="'background: ' + (item.backgroundColor ?? '#F5F6F7')"
  >
    <NuxtLink
      :to="parseLink(item.showAllLink)"
      class="aspect-square w-[120px] rounded-2xl md:w-1/2 md:rounded-none md:rounded-l-2xl"
    >
      <CoverImage
        :src="item.coverUrl"
        :alt="item.title"
        class="rounded-2xl md:rounded-none md:rounded-l-2xl"
        no-border
      />
    </NuxtLink>
    <div
      class="flex grow cursor-pointer flex-col gap-0.5 rounded-r-2xl p-0 text-black-1 md:w-1/2 md:p-4"
      :style="'background: ' + (item.backgroundColor ?? '#F5F6F7')"
      @click.stop="playTrack"
    >
      <div class="truncate leading-5 opacity-70">{{ item.title }}</div>
      <div
        class="max-h-[48px] overflow-hidden text-[16px] font-semibold leading-5 lg:text-lg lg:leading-6"
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
      <div class="mt-auto flex w-full flex-row pt-1.5">
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
