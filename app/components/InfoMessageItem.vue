<script setup lang="ts">
import type { InfoMessageModel } from "@bcc-code/bmm-sdk-fetch";

defineProps<{
  item: InfoMessageModel;
}>();
</script>

<template>
  <div class="col-span-full">
    <NuxtLink
      v-if="item.link"
      :to="parseLink(item.link)"
      :target="isInternalLink(item.link || '') ? '_self' : '_blank'"
      class="col-span-full flex gap-3 rounded-2xl bg-background-2 p-4 font-medium"
    >
      <div>
        <NuxtIcon name="icon.alert" class="text-2xl" />
      </div>
      <div class="flex flex-wrap items-center gap-3">
        {{ item.messageText }}
        <ButtonStyled
          v-if="item.translatedButtonText"
          intent="secondary"
          size="small"
          class="-my-1 brightness-95 dark:brightness-150"
        >
          {{ item.translatedButtonText }}
          <NuxtIcon name="icon.chevron.right" class="ml-auto text-lg" />
        </ButtonStyled>
      </div>
    </NuxtLink>
    <div
      v-else
      class="col-span-full flex gap-3 rounded-2xl bg-background-2 p-4 font-medium"
    >
      <div>
        <NuxtIcon name="icon.alert" class="text-2xl" />
      </div>
      {{ item.messageText }}
    </div>
  </div>
</template>
