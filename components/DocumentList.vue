<script setup lang="ts">
import type { DocumentListIAllDocumentModels } from "@bcc-code/bmm-sdk-fetch";

const props = defineProps<{
  list: DocumentListIAllDocumentModels | null;
  pending: boolean;
}>();

watch(
  props,
  () => {
    toolbarTitleStore().setToolbarTitle(props.list?.title ?? " ");
  },
  { immediate: true },
);
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
      <DocumentModels
        v-if="list && list.items"
        :models="list.items"
      ></DocumentModels>
    </template>
  </div>
</template>
