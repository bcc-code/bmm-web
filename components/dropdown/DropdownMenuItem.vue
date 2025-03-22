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
  removeFlex?: boolean;
}>();

const nuxtLink = resolveComponent("NuxtLink");
const component = computed(() =>
  props.to || props.href ? nuxtLink : "button",
);
</script>
<template>
  <MenuItem v-slot="{ active, close }" as="template">
    <slot name="item" :active="active">
      <component
        :is="component"
        :to="to"
        :href="href"
        :class="{
          'bg-label-separator': active,
          flex: !props.removeFlex,
        }"
        class="type-subtitle-2 w-full items-center justify-between whitespace-normal rounded-lg px-3 py-2 text-left"
      >
        <slot :active="active">
          <div class="flex-1 truncate" @click="to && close()">
            <span class="flex items-center gap-2" :title="title">
              <NuxtIcon v-if="icon" :name="icon" />
              {{ title }}
            </span>
            <span class="type-subtitle-3 text-label-3" :title="secondaryTitle">
              {{ secondaryTitle }}
            </span>
          </div>
          <div>
            <slot name="right" />
          </div>
        </slot>
      </component>
    </slot>
  </MenuItem>
</template>
