<script lang="ts" setup>
import type { IAlbumOrChapterHeader } from "@bcc-code/bmm-sdk-fetch";
import { useInfiniteScroll } from "@vueuse/core";

const { data: models, pending } = useBrowseEvents();
setTitleOfDocumentList(models);

const main = ref<HTMLElement | null>(document.querySelector("main"));
const el = ref<HTMLElement | null>(null);
const blank: IAlbumOrChapterHeader[] = [];
const list = ref(blank);
const tries = ref(0);
useInfiniteScroll(
  main,
  async () => {
    console.log("load more");
    if (models.value?.items) {
      if (list.value.length === 0)
        list.value = list.value.concat(models.value?.items);
      else {
        const data = await useBrowseEvents(list.value.length);
        if (data.data.value?.items)
          list.value = list.value.concat(data.data.value?.items);
      }
      // list.value = list.value.concat(models.value?.items);
      console.log("adding more", models.value);
    } else console.log("nothing to add");
    tries.value += 1;
  },
  { distance: 10, canLoadMore: () => !pending && tries.value < 10 },
);
</script>

<template>
  <div ref="el">
    <DocumentList :items="list" :pending="pending" />
  </div>
</template>
