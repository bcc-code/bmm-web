<script lang="ts" setup>
import { cva } from "class-variance-authority";
import type { NuxtIconName } from "#build/nuxt-icons";

const slots = useSlots();
withDefaults(
  defineProps<{
    intent?: "primary" | "secondary";
    size?: "large" | "medium" | "small";
    icon?: NuxtIconName | null;
  }>(),
  {
    intent: "secondary",
    size: "medium",
    icon: null,
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
      large: "py-4 px-8 type-title-1",
      medium: `leading-6 text-lg font-semibold ${
        !slots.default ? "p-2" : "px-4 py-2"
      }`,
      small: "type-title-3 py-1.5 px-3",
    },
    iconOnly: {
      true: "aspect-square",
    },
  },
});
</script>

<template>
  <button :class="className({ iconOnly: !slots.default, intent, size })">
    <NuxtIcon
      v-if="icon"
      :name="icon"
      class="text-2xl leading-none"
      :class="!!slots.default ? '-ml-1.5' : ''"
    />
    <slot />
  </button>
</template>
