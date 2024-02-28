<script lang="ts" setup>
import type { CurrentWeeksStreakVm } from "@bcc-code/bmm-sdk-fetch";

const props = defineProps<{
  item: CurrentWeeksStreakVm;
}>();

const getDays = (item: CurrentWeeksStreakVm) => {
  return [
    {
      listened: item.monday,
      day: "Monday",
      color: "#DBE459",
    },
    {
      listened: item.tuesday,
      day: "Tuesday",
      color: "#B9CC68",
    },
    {
      listened: item.wednesday,
      day: "Wednesday",
      color: "#83A174",
    },
    {
      listened: item.thursday,
      day: "Thursday",
      color: "#4E7780",
    },
    { listened: item.friday, day: "Friday", color: "#265789" },
  ];
};
</script>

<template>
  <div class="col-span-full flex gap-6">
    <div class="flex flex-col">
      <div class="font-semibold leading-5">Your streak this week</div>
      <div class="text-label-3 text-[15px] leading-5">
        {{ item.daysInARow }} days in a row
      </div>
    </div>
    <div class="flex flex-row items-center gap-1">
      <div
        v-for="day in getDays(item)"
        class="rounded-full aspect-square p-2 flex items-center justify-center"
        :class="item.dayOfTheWeek === day.day ? 'bg-background-2' : ''"
      >
        <div
          class="rounded-full aspect-square w-3"
          :class="day.listened ? 'bg-[#DBE459]' : ' border border-label-4'"
          :style="'background: ' + (day.listened ? day.color : 'none')"
        ></div>
      </div>
    </div>
    {{ console.log(item) }}
  </div>
</template>
