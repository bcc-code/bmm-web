<script lang="ts" setup>
import { cva } from "class-variance-authority";

const props = withDefaults(
  defineProps<{
    level?: 1 | 2 | 3 | 4 | 5;
  }>(),
  {
    level: 1,
  }
);

const component = computed(() => `h${props.level}`);

const className = cva("font-bold", {
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
  <component :is="component" :class="className({ level })">
    <slot />
  </component>
</template>
