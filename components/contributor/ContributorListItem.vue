<script lang="ts" setup>
import type { ContributorModel } from "@bcc-code/bmm-sdk-fetch";

defineProps<{
  contributor: ContributorModel;
}>();
</script>

<template>
  <li
    class="group grid col-span-5 relative grid-cols-subgrid cursor-pointer gap-3 py-3"
  >
    <NuxtLink
      class="grid col-span-5 grid-cols-subgrid"
      :to="{
        name: 'playlist-contributor-id',
        params: { id: contributor.id },
      }"
    >
      <div
        class="absolute -inset-x-4 -inset-y-0 rounded-xl bg-background-2 opacity-0 group-hover:opacity-100"
      ></div>
      <div class="relative grid col-span-5 grid-cols-subgrid">
        <div>
          <ProtectedImage
            v-if="contributor.cover"
            :src="contributor.cover"
            alt=""
            class="aspect-square w-10 rounded-xl bg-background-2"
          />
        </div>
        <div class="col-span-3 flex items-center">
          <h4
            class="overflow-hidden text-ellipsis whitespace-nowrap font-semibold"
            :title="contributor.name || ''"
          >
            {{ contributor.name }}
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
