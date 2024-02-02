<script setup lang="ts">
import type { IAllDocumentModels } from "@bcc-code/bmm-sdk-fetch";

const props = defineProps<{
  items: Array<IAllDocumentModels> | null | undefined;
  pending: boolean;
}>();
</script>

<template>
  <div>
    <template v-if="props.pending">
      <ul>
        <li
          v-for="index in 5"
          :key="index"
          class="my-6 h-11 w-full animate-pulse rounded-lg bg-background-2"
        ></li>
      </ul>
    </template>
    <template v-else>
      <DocumentModels v-if="items" :models="items"></DocumentModels>
    </template>
  </div>
</template>
