<script setup lang="ts">
import type { NuxtIconName } from "#build/nuxt-icons";
import { MenuItem } from "@headlessui/vue";
import type { RoutesNamedLocations } from "@typed-router";

const props = defineProps<{
  title?: string;
  secondaryTitle?: string;
  icon?: NuxtIconName | undefined;
  to?: RoutesNamedLocations;
  href?: string;
}>();

const nuxtLink = resolveComponent("NuxtLink");
const component = computed(() =>
  props.to || props.href ? nuxtLink : "button",
);
</script>
<template>
  <MenuItem v-slot="{ active, close }" as="template">
    <component
      :is="component"
      :to="to"
      :href="href"
      :class="{
        'bg-label-separator': active,
      }"
      class="type-subtitle-2 block w-full items-center justify-between rounded-lg px-3 py-2 text-left"
    >
      <slot :active="active">
        <div class="whitespace-normal" @click="to && close()">
          <span class="flex items-center gap-2">
            <NuxtIcon v-if="icon" :name="icon" />
            {{ title }}
          </span>
          <span class="type-subtitle-3 text-label-3">
            {{ secondaryTitle }}
          </span>
        </div>
        <div>
          <slot name="right" />
        </div>
      </slot>
    </component>
  </MenuItem>
</template>
