<script lang="ts" setup>
import type { ContributorModel } from "@bcc-code/bmm-sdk-fetch";

defineProps<{
  contributor: ContributorModel;
}>();
</script>

<template>
  <li class="group col-span-5 relative mr-3 cursor-pointer py-3">
    <NuxtLink
      :to="{
        name: 'playlist-contributor-id',
        params: { id: contributor.id },
      }"
    >
      <div
        class="absolute -inset-x-4 -inset-y-0 rounded-xl bg-background-2 opacity-0 group-hover:opacity-100"
      ></div>
      <div class="relative flex items-center justify-between gap-3">
        <div class="w-10">
          <ProtectedImage
            v-if="contributor.cover"
            :src="contributor.cover"
            alt=""
            class="aspect-square w-10 rounded-xl bg-background-2"
          />
        </div>
        <div class="mr-auto w-1/3">
          <h4
            class="overflow-hidden text-ellipsis whitespace-nowrap font-semibold"
            :title="contributor.name || ''"
          >
            {{ contributor.name }}
          </h4>
        </div>
        <div class="ml-auto flex items-center justify-center gap-1">
          <button class="focus:bg-lime-400 rounded-lg px-2 py-0">
            <NuxtIcon name="icon.chevron.right" class="text-2xl" />
          </button>
        </div>
      </div>
    </NuxtLink>
  </li>
</template>
