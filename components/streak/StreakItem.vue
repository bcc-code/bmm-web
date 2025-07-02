<script lang="ts" setup>
import { DayOfWeek } from "@bcc-code/bmm-sdk-fetch";
import type { CurrentWeeksStreakVm } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();

const props = defineProps<{
  item: CurrentWeeksStreakVm;
}>();

const showDialog = ref(false);

const now = useNow();
const timeLeft = computed(() => {
  const end = props.item.eligibleUntil;
  if (!end)
    return {
      hours: 0,
      minutes: 0,
    };

  const diff = end.getTime() - now.value.getTime();

  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
  };
});

const daysOfWeek: Partial<Record<DayOfWeek, keyof CurrentWeeksStreakVm>> = {
  [DayOfWeek.Monday]: "monday",
  [DayOfWeek.Tuesday]: "tuesday",
  [DayOfWeek.Wednesday]: "wednesday",
  [DayOfWeek.Thursday]: "thursday",
  [DayOfWeek.Friday]: "friday",
};
const todayListened = computed(() => {
  if (!props.item.dayOfTheWeek) return false;
  const key = daysOfWeek[props.item.dayOfTheWeek];
  if (!key) return false;
  return Boolean(props.item[key]);
});

const shouldShowTimeLeft = computed(
  () =>
    !todayListened.value &&
    timeLeft.value.hours >= 0 &&
    timeLeft.value.minutes >= 0,
);
</script>

<template>
  <button
    class="col-span-full flex items-center gap-6 text-start"
    @click="showDialog = true"
  >
    <div class="flex flex-col">
      <div class="font-semibold leading-5">{{ t("streak.your-streak") }}</div>
      <div class="text-[15px] leading-5 text-label-3">
        {{ t("streak.days-in-row", item.daysInARow ?? 0) }}
      </div>
    </div>
    <StreakItemDots :item size="small" />
  </button>
  <DialogBase
    :show="showDialog"
    :title="$t('streak.your-streak')"
    @close="showDialog = false"
  >
    <div class="min-w-[400px]">
      <p
        v-if="shouldShowTimeLeft"
        class="mb-6 text-center text-sm text-label-4"
      >
        {{ $t("streak.time-left-today", timeLeft) }}
      </p>
      <div class="mb-6">
        <StreakItemDots :item size="large" />
      </div>
      <div
        class="type-subtitle-3 flex items-center justify-between text-label-3"
      >
        <span>
          {{ $t("streak.days-in-row", { count: item.daysInARow ?? 0 }) }}
        </span>
        <span>
          {{
            $t("streak.perfect-weeks", {
              count: item.numberOfPerfectWeeks ?? 0,
            })
          }}
        </span>
      </div>
    </div>
  </DialogBase>
</template>
