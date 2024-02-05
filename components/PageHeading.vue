<script lang="ts" setup>
import { cva, cx } from "class-variance-authority";

const props = withDefaults(
  defineProps<{
    level: 1 | 2 | 3 | 4 | 5;
    class?: string;
  }>(),
  {
    level: 1,
  },
);

defineSlots<{
  default: (props: {}) => any;
}>();

const component = computed(() => `h${props.level}`);

const className = cva("font-bold leading-tight text-label-1 mt-6 mb-6", {
  variants: {
    level: {
      1: "text-5xl",
      2: "text-4xl",
      3: "text-2xl",
      4: "text-xl",
      5: "text-base",
    },
  },
});
</script>

<template>
  <component :is="component" :class="cx([className({ level }), props.class])">
    <slot />
  </component>
</template>
