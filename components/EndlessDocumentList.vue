<script setup lang="ts">
import type { IAllDocumentModels } from "@bcc-code/bmm-sdk-fetch";

import { useInfiniteScroll } from "@vueuse/core";

const { t } = useI18n();

const props = defineProps<{
  items: IAllDocumentModels[] | null | undefined;
  pending: boolean;
}>();

function onLoadMore() {
  console.log("load more");
}
const el = ref<HTMLElement | null>(null);
useInfiniteScroll(
  el,
  () => {
    console.log("load more");
  },
  { distance: 2 },
);
</script>

<template>
  <div ref="el">
    <DocumentList :items="items" :pending="pending"></DocumentList>
  </div>
</template>
