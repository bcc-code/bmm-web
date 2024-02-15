<script lang="ts" setup>
import type { TileModel } from "@bcc-code/bmm-sdk-fetch";

defineProps<{
  item: TileModel;
}>();

const emit = defineEmits<{ "play-track": [] }>();
const { t } = useI18n();

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
    class="rounded-2xl bg- w-[400px] h-[200px] flex flex-row"
  >
    <NuxtLink
      :to="parseLink(item.showAllLink)"
      class="w-1/2 aspect-square rounded-l-2xl"
    >
      <ProtectedImage
        v-if="item.coverUrl"
        :src="item.coverUrl"
        :alt="item.title"
        class="aspect-square rounded-l-2xl"
        no-border
      />
    </NuxtLink>
    <div
      class="w-1/2 p-6 rounded-r-2xl text-black-1 cursor-pointer flex flex-col"
      :style="'background: ' + (item.backgroundColor ?? '#F5F6F7')"
      @click.stop="playTrack"
    >
      <div class="opacity-70">{{ item.title }}</div>
      <div class="font-semibold text-lg">{{ item.label }}</div>
      <div v-if="item.date" class="text-sm">
        {{ weekDay(item.date) }}
        <span class="opacity-70">{{ formatDate(item.date) }}</span>
      </div>
      <div v-else class="text-sm">
        {{ item.subtitle }}
      </div>
      <div class="flex flex-row w-full mt-auto">
        <button
          class="bg-black-1 rounded-full w-10 h-10"
          @click.stop="playTrack"
        >
          <NuxtIcon name="icon.play" class="text-white-1 text-2xl p-2" />
        </button>
        <TrackMenu :track="item.track" class="ml-auto"></TrackMenu>
      </div>
    </div>
  </div>
</template>
