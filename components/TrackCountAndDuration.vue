<script setup lang="ts">
const { t } = useI18n();
defineProps<{
  trackCount: number;
  seconds: number;
}>();
</script>
<template>
  <template v-if="seconds && seconds > 0">
    {{ t("collection.track-count", trackCount) }},
    <template v-if="seconds / 60 < 60">
      {{
        t("global.minutes-and-seconds", [
          Math.floor(seconds / 60),
          Math.floor(seconds % 60),
        ])
      }}
    </template>
    <template v-else>
      {{
        t("global.hours-and-minutes", [
          Math.floor(seconds / 60 / 60),
          Math.floor((seconds / 60) % 60),
        ])
      }}
    </template></template
  >
  <template v-else>{{ t("collection.track-count", trackCount) }}</template>
</template>
