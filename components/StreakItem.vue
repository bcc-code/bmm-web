<script lang="ts" setup>
import type { CurrentWeeksStreakVm } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();

defineProps<{
  item: CurrentWeeksStreakVm;
}>();

const getDays = (item: CurrentWeeksStreakVm) => [
  {
    listened: item.monday,
    day: "Monday",
    color: item.pointColor ?? "#DBE459",
  },
  {
    listened: item.tuesday,
    day: "Tuesday",
    color: item.pointColor ?? "#B9CC68",
  },
  {
    listened: item.wednesday,
    day: "Wednesday",
    color: item.pointColor ?? "#83A174",
  },
  {
    listened: item.thursday,
    day: "Thursday",
    color: item.pointColor ?? "#4E7780",
  },
  {
    listened: item.friday,
    day: "Friday",
    color: item.pointColor ?? "#265789",
  },
];
</script>

<template>
  <div class="col-span-full flex gap-6">
    <div class="flex flex-col">
      <div class="font-semibold leading-5">{{ t("streak.your-streak") }}</div>
      <div class="text-[15px] leading-5 text-label-3">
        {{ t("streak.days-in-row", item.daysInARow ?? 0) }}
      </div>
    </div>
    <div class="flex flex-row items-center gap-1">
      <div
        v-for="day in getDays(item)"
        :key="day.day"
        class="flex aspect-square items-center justify-center rounded-full p-2"
        :class="item.dayOfTheWeek === day.day ? 'bg-background-2' : ''"
      >
        <div
          class="aspect-square w-3 rounded-full"
          :class="{ 'border border-label-4': !day.listened }"
          :style="'background: ' + (day.listened ? day.color : 'none')"
        ></div>
      </div>
    </div>
  </div>
</template>
