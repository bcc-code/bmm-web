<script lang="ts" setup>
import { cva } from "class-variance-authority";
import type { NuxtIconName } from "#build/nuxt-icons";

const slots = useSlots();
withDefaults(
  defineProps<{
    intent?: "primary" | "secondary" | "tertiary";
    size?: "large" | "medium" | "small";
    icon?: NuxtIconName | null;
    disabled?: boolean;
    loading?: boolean;
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

const className = cva(
  "rounded-full flex gap-1 justify-center items-center relative",
  {
    variants: {
      intent: {
        primary: "bg-background-4 text-on-color-1",
        secondary: "bg-background-2 text-label-1",
        tertiary: "text-label-1 border border-label-separator",
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
      disabled: {
        true: "opacity-50 cursor-not-allowed",
      },
    },
  },
);
</script>

<template>
  <button
    :class="className({ iconOnly: !slots.default, intent, size, disabled })"
  >
    <NuxtIcon
      v-if="loading"
      name="spinner"
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    />
    <span
      :class="[
        'flex gap-1.5 transition duration-150 ease-out',
        { 'translate-y-1 opacity-0': loading },
      ]"
    >
      <NuxtIcon
        v-if="icon"
        :name="icon"
        class="text-2xl leading-none"
        :class="!!slots.default ? '-ml-1.5' : ''"
      />
      <slot />
    </span>
  </button>
</template>
