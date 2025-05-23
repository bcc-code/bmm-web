<script setup lang="ts">
import type { CurrentWeeksStreakVm } from "@bcc-code/bmm-sdk-fetch";

defineProps<{
  item: CurrentWeeksStreakVm;
  size: "small" | "large";
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
  <div class="grid grid-cols-5 gap-1">
    <template v-if="size === 'small'">
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
    </template>
    <template v-if="size === 'large'">
      <div
        v-for="day in getDays(item)"
        :key="day.day"
        class="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl px-4 pb-3 pt-4"
        :class="item.dayOfTheWeek === day.day ? 'bg-background-2' : ''"
      >
        <div
          class="aspect-square w-3 rounded-full"
          :class="{ 'border border-label-4': !day.listened }"
          :style="'background: ' + (day.listened ? day.color : 'none')"
        />
        <span class="type-title-3">{{ day.day[0] }}</span>
      </div>
    </template>
  </div>
</template>
