<script lang="ts" setup>
import type { RoutesNamedLocations } from "@typed-router";

defineProps<{
  route: RoutesNamedLocations;
  cover: string | undefined | null;
  circle?: boolean;
  label: string | undefined | null;
}>();
</script>

<template>
  <li
    class="group grid col-span-full relative grid-cols-subgrid cursor-pointer gap-3 py-3"
  >
    <NuxtLink class="grid col-span-full grid-cols-subgrid" :to="route">
      <div
        class="absolute -inset-x-4 -inset-y-0 rounded-xl bg-background-2 opacity-0 group-hover:opacity-100"
      ></div>
      <div class="relative grid col-span-full grid-cols-subgrid">
        <CoverImage
          :src="cover"
          class="w-10"
          :class="circle ? 'rounded-full' : 'rounded'"
        />
        <div class="col-span-3 flex items-center">
          <h4
            class="block truncate text-[17px] leading-6 font-medium"
            :title="label || ''"
          >
            {{ label }}
          </h4>
        </div>
        <div class="flex justify-end">
          <button class="px-2">
            <NuxtIcon name="icon.chevron.right" class="text-2xl" />
          </button>
        </div>
      </div>
    </NuxtLink>
  </li>
</template>
