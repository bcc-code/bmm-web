<script lang="ts" setup>
withDefaults(
  defineProps<{
    showSkeleton?: boolean;
    skeletonCount?: number;
  }>(),
  {
    skeletonCount: 5,
  }
);
</script>

<template>
  <ol class="divide-y divide-slate-100 w-full">
    <template v-if="showSkeleton">
      <li
        class="w-full h-12 bg-slate-100 rounded-lg my-6"
        v-for="skeleton in skeletonCount"
        :key="skeleton"
      ></li>
    </template>
    <template v-else>
      <slot />
    </template>
  </ol>
</template>
