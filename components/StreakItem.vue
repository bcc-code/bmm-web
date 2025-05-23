<script lang="ts" setup>
import type { CurrentWeeksStreakVm } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();

defineProps<{
  item: CurrentWeeksStreakVm;
}>();

const showDialog = ref(false);
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
    <div class="min-w-60">
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
