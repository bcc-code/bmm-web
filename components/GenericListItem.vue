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
    class="group relative col-span-full grid cursor-pointer grid-cols-subgrid gap-3 py-3"
  >
    <NuxtLink class="col-span-full grid grid-cols-subgrid" :to="route">
      <div
        class="absolute -inset-x-4 -inset-y-0 rounded-xl bg-background-2 opacity-0 group-hover:opacity-100"
      ></div>
      <div class="relative col-span-full grid grid-cols-subgrid">
        <CoverImage
          :src="cover"
          class="hidden w-10 lg:block"
          :class="circle ? 'rounded-full' : 'rounded'"
        />
        <div class="col-span-3 flex items-center">
          <h4
            class="block truncate text-[17px] font-medium leading-6"
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
