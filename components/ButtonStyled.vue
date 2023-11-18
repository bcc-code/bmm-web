<script lang="ts" setup>
import { cva } from "class-variance-authority";

withDefaults(
  defineProps<{
    intent: "primary" | "secondary";
    size: "large" | "medium" | "small";
  }>(),
  {
    intent: "secondary",
    size: "medium",
  },
);

defineSlots<{
  default: (props: {}) => any;
}>();

const className = cva("py-3 px-6 rounded-full flex gap-3 items-center", {
  variants: {
    intent: {
      primary:
        "dark:bg-background-dark-4 bg-background-4 text-on-color-1 dark:text-on-color-dark-1",
      secondary:
        "dark:bg-background-dark-2 bg-background-2 text-label-1 dark:text-label-dark-1",
    },
    size: {
      large: "text-lg",
      medium: "text-base",
      small: "text-sm",
    },
  },
});
</script>

<template>
  <button :class="className({ intent, size })">
    <slot />
  </button>
</template>
