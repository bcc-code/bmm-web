<script lang="ts" setup>
import { BrowseApi } from "@bcc-code/bmm-sdk-fetch";
import type { IAlbumOrChapterHeader } from "@bcc-code/bmm-sdk-fetch";
import { useInfiniteScroll } from "@vueuse/core";

const { data: models, pending } = useBrowseEvents();
setTitleOfDocumentList(models);

const api = new BrowseApi();
const list = ref<IAlbumOrChapterHeader[]>([]);
const tries = ref(0);
const loadingMore = ref(false);
let position = 20;
const fullyLoaded = ref(false);
onMounted(() => {
  const main = ref<HTMLElement | null>(document.querySelector("main"));
  useInfiniteScroll(
    main,
    () => {
      if (loadingMore.value) {
        console.log("already loading more");
        return;
      }
      console.log(
        `load more loadingMore: ${loadingMore.value} position: ${position}`,
      );
      if (models.value?.items) {
        if (list.value.length === 0)
          list.value = list.value.concat(models.value?.items);
        else {
          loadingMore.value = true;

          api
            .browseEventsGet({ skip: position, take: 40 })
            .then((data) => {
              position += 40;
              if (data.items) {
                if (data.items.length === 0) fullyLoaded.value = true;
                for (let i = 0; i < data.items.length; i++) {
                  const item = data.items[i];
                  if (item) list.value.push(item);
                }
              }
              loadingMore.value = false;
            })
            .catch((e) => {
              console.error("error", e);
            });
        }
      } else console.log("nothing to add");
      tries.value += 1;
    },
    { distance: 10, interval: 1000, canLoadMore: () => !fullyLoaded.value }, //, canLoadMore: () => tries.value < 10 },
  );
});
</script>

<template>
  <div>
    <DocumentList :items="list" :pending="pending" />
    <div v-if="loadingMore" class="p-10">Loading more</div>
  </div>
</template>
