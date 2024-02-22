<script lang="ts" setup>
import { cva } from "class-variance-authority";
import type { NuxtIconName } from "#build/nuxt-icons";

const props = withDefaults(
  defineProps<{
    intent?: "primary" | "secondary";
    size?: "large" | "medium" | "small";
    icon?: NuxtIconName | null;
    iconOnly?: boolean;
  }>(),
  {
    intent: "secondary",
    size: "medium",
    icon: null,
    iconOnly: false,
  },
);

defineSlots<{
  default: (props: {}) => any;
}>();

const className = cva("rounded-full flex gap-1 justify-center items-center", {
  variants: {
    intent: {
      primary: "bg-background-4 text-on-color-1",
      secondary: "bg-background-2 text-label-1",
    },
    size: {
      large: "text-xl py-3 px-6",
      medium: `leading-6 text-lg font-semibold ${
        props.iconOnly ? "p-2" : "px-4 py-2"
      }`,
      small: "text-sm py-1.5 px-3",
    },
    iconOnly: {
      true: "aspect-square",
    },
  },
});
</script>

<template>
  <button :class="className({ iconOnly, intent, size })">
    <NuxtIcon
      v-if="icon"
      :name="icon"
      class="text-2xl leading-none"
      :class="!iconOnly ? 'ml-[-6px]' : ''"
    />
    <slot />
  </button>
</template>
