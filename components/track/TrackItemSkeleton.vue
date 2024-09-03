<script setup lang="ts">
defineProps<{
  showThumbnail?: boolean;
}>();
</script>

<template>
  <div class="col-span-full flex items-center justify-between gap-4 py-3">
    <div class="flex gap-3">
      <div
        v-if="showThumbnail"
        class="size-10 animate-pulse rounded-md bg-label-separator"
      />
      <div class="flex flex-col justify-center gap-1.5">
        <div class="h-5 w-[400px] animate-pulse rounded bg-label-separator" />
        <div class="h-3.5 w-[100px] animate-pulse rounded bg-label-separator" />
      </div>
    </div>
    <div
      class="hidden h-4 w-[200px] animate-pulse rounded bg-label-separator lg:block"
    />
    <div
      class="hidden h-4 w-[100px] animate-pulse rounded bg-label-separator lg:block"
    />
    <div class="h-3 w-8 animate-pulse rounded bg-label-separator" />
  </div>
</template>
