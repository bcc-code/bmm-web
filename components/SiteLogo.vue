<script lang="ts" setup>
import { cva } from "class-variance-authority";

defineProps<{
  size: "small" | "medium" | "large";
}>();

const className = cva(null, {
  variants: {
    size: {
      small: "w-12",
      medium: "w-20",
      large: "w-32",
    },
  },
});
</script>

<template>
  <img src="/logo.svg" alt="BMM logo" :class="className({ size })" />
</template>
