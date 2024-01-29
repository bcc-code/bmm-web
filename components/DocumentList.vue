<script setup lang="ts">
import type {
  DocumentListIAllDocumentModels,
  IAllDocumentModels,
} from "@bcc-code/bmm-sdk-fetch";

const props = defineProps<{
  list: DocumentListIAllDocumentModels | null;
  pending: boolean;
}>();

toolbarTitleStore().setReactiveToolbarTitle(() => props.list?.title ?? " ");
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
        v-if="
          list !== null &&
          list !== undefined &&
          list.items !== null &&
          list.items !== undefined
        "
        :models="list.items as IAllDocumentModels[]"
      ></DocumentModels>
    </template>
  </div>
</template>
