<script lang="ts" setup>
import { BrowseApi } from "@bcc-code/bmm-sdk-fetch";
import type { IAlbumOrChapterHeader } from "@bcc-code/bmm-sdk-fetch";
import { useInfiniteScroll } from "@vueuse/core";

const api = new BrowseApi();
const list = ref<IAlbumOrChapterHeader[]>([]);
const tries = ref(0);
const loadingMore = ref(false);
let position = 0;
const fullyLoaded = ref(false);
onMounted(() => {
  const main = ref<HTMLElement | null>(document.querySelector("main"));
  useInfiniteScroll(
    main,
    () => {
      if (loadingMore.value) {
        return;
      }

      loadingMore.value = true;
      api
        .browseEventsGet({ skip: position, take: 40 })
        .then((data) => {
          toolbarTitleStore().setToolbarTitle(data.title || "");
          position += 40;
          if (data.items) {
            if (data.items.length === 0) fullyLoaded.value = true;

            list.value = list.value.concat(data.items);
          }
          loadingMore.value = false;
        })
        .catch((e) => {
          console.error("error", e);
        });

      tries.value += 1;
    },
    { distance: 10, interval: 500, canLoadMore: () => !fullyLoaded.value }, //, canLoadMore: () => tries.value < 10 },
  );
});
</script>

<template>
  <div>
    <DocumentList :items="list" :pending="false" />
    <ul v-if="loadingMore">
      <li
        v-for="index in 5"
        :key="index"
        class="my-6 h-11 w-full animate-pulse rounded-lg bg-background-2"
      ></li>
    </ul>
  </div>
</template>
