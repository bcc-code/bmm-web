<script setup lang="ts" generic="TValue extends string | number">
defineProps<{
  label: string;
  value: TValue;
}>();
</script>

<template>
  <div
    class="flex flex-col gap-1 rounded-2xl border-label-separator bg-background-2 p-4 sm:px-7 sm:py-6"
  >
    <span class="type-subtitle-2 text-label-3">{{ label }}</span>
    <span class="type-heading-1 tabular-nums text-label-1">
      <slot name="value" :value="value">
        {{ value }}
      </slot>
    </span>
  </div>
</template>
