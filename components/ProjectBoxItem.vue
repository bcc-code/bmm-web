<script lang="ts" setup>
import type { ProjectBoxV2 } from "@bcc-code/bmm-sdk-fetch";

defineProps<{
  item: ProjectBoxV2;
}>();
</script>

<template>
  <div class="col-span-full rounded-2xl border-t-0 bg-background-2">
    <div class="p-4">
      <h3 v-if="item.title" class="type-title-2">
        {{ item.title }}
      </h3>
      <p class="type-subtitle-2 text-label-3">{{ item.pointsDescription }}</p>
    </div>
    <div class="flex gap-4 overflow-x-scroll py-4 pt-0">
      <ProtectedImage
        v-for="achievement in item.achievements"
        :key="achievement.id!"
        :src="achievement.url!"
        :title="achievement.title!"
        class="size-20 first:ml-4 last:mr-4"
      />
    </div>
  </div>
</template>
