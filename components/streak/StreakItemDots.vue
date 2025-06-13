<script setup lang="ts">
import type { CurrentWeeksStreakVm } from "@bcc-code/bmm-sdk-fetch";

const props = defineProps<{
  item: CurrentWeeksStreakVm;
  size: "small" | "large";
}>();

const days = computed(() =>
  [
    {
      listened: props.item.monday,
      day: "Monday",
      color: props.item.pointColor ?? "#DBE459",
    },
    {
      listened: props.item.tuesday,
      day: "Tuesday",
      color: props.item.pointColor ?? "#B9CC68",
    },
    {
      listened: props.item.wednesday,
      day: "Wednesday",
      color: props.item.pointColor ?? "#83A174",
    },
    {
      listened: props.item.thursday,
      day: "Thursday",
      color: props.item.pointColor ?? "#4E7780",
    },
    {
      listened: props.item.friday,
      day: "Friday",
      color: props.item.pointColor ?? "#265789",
    },
  ].filter(({ listened }) => typeof listened === "boolean"),
);
</script>

<template>
  <div
    :style="{ '--columns': days.length }"
    class="grid grid-cols-[repeat(var(--columns),minmax(0,1fr))] gap-1"
  >
    <template v-if="size === 'small'">
      <div
        v-for="day in days"
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
        v-for="day in days"
        :key="day.day"
        class="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl px-4 pb-3 pt-4"
        :class="item.dayOfTheWeek === day.day ? 'bg-background-2' : ''"
      >
        <div
          class="aspect-square w-3 rounded-full"
          :class="{ 'border border-label-4': !day.listened }"
          :style="'background: ' + (day.listened ? day.color : 'none')"
        />
        <span class="type-title-3">
          {{ day.day.charAt(0).toUpperCase() }}
        </span>
      </div>
    </template>
  </div>
</template>
