<script setup lang="ts">
import type { IAllDocumentModels } from "@bcc-code/bmm-sdk-fetch";
import { useInfiniteScroll } from "@vueuse/core";

const props = defineProps<{
  load: (skip: number, take: number) => Promise<IAllDocumentModels[]>;
}>();

const list = ref<IAllDocumentModels[]>([]);
const loadingMore = ref(false);
let position = 0;
const fullyLoaded = ref(false);
onMounted(() => {
  const main = ref<HTMLElement | null>(document.querySelector("main"));
  useInfiniteScroll(
    main,
    () => {
      if (loadingMore.value || fullyLoaded.value) {
        return;
      }

      loadingMore.value = true;
      props
        .load(position, 40)
        .then((data) => {
          position += 40;
          if (data) {
            if (data.length === 0) {
              console.log(`list is fully loaded. position: ${position}`);
              fullyLoaded.value = true;
            }

            list.value = list.value.concat(data);
          }
          loadingMore.value = false;
        })
        .catch((e) => {
          console.error("error", e);
        });
    },
    { distance: 10, interval: 500, canLoadMore: () => !fullyLoaded.value },
  );
});
watch(
  [useNuxtApp().$i18n.locale, () => contentLanguageStore().contentLanguages],
  async () => {
    const data = await props.load(0, position);
    list.value = data;
    fullyLoaded.value = false;
  },
);
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
