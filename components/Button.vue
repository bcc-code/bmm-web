<script lang="ts" setup>
import { cva } from "class-variance-authority";

withDefaults(
  defineProps<{
    intent?: "primary" | "secondary";
  }>(),
  {
    intent: "primary",
  }
);

const className = cva("py-3 px-6 rounded-full flex gap-3 items-center", {
  variants: {
    intent: {
      primary: "bg-slate-900 text-slate-100 hover:bg-slate-700",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    },
  },
});
</script>

<template>
  <button :class="className({ intent })">
    <slot />
  </button>
</template>
