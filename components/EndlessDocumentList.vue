<script setup lang="ts">
import type { IAllDocumentModels } from "@bcc-code/bmm-sdk-fetch";
import { useInfiniteScroll } from "@vueuse/core";

const props = defineProps<{
  load: (skip: number, take: number) => Promise<IAllDocumentModels[]>;
  useDailyPodcastView?: boolean | undefined;
  origin?: string;
}>();

const list = ref<IAllDocumentModels[]>([]);
const loadingMore = ref(false);
let position = 0;
const fullyLoaded = ref(false);

const maybeLoad = async () => {
  if (loadingMore.value || fullyLoaded.value) {
    return;
  }

  loadingMore.value = true;
  try {
    const data = await props.load(position, 40);
    position += 40;
    if (data) {
      if (data.length === 0) {
        fullyLoaded.value = true;
      }

      list.value = list.value.concat(data);
    }
    loadingMore.value = false;
  } catch (ex) {
    // TODO: Show an error message to the user
    console.error("error", ex);
  }
};

const main = ref<HTMLElement | null>();
onMounted(() => {
  main.value = document.querySelector("main");
  useInfiniteScroll(main, maybeLoad, {
    distance: 10,
    interval: 500,
    canLoadMore: () => !fullyLoaded.value,
  });
  maybeLoad();
});
watch(reactiveDependencies(), async () => {
  try {
    const data = await props.load(0, position);
    list.value = data;
    fullyLoaded.value = false;
  } catch (ex) {
    // TODO: Show an error message to the user
    console.error(ex);
  }
});
</script>

<template>
  <div>
    <DocumentList
      :items="list"
      :pending="false"
      :use-daily-podcast-view="useDailyPodcastView"
      :origin="origin"
    />
    <ul v-if="loadingMore" class="divide-y divide-label-separator">
      <TrackItemSkeleton v-for="index in 10" :key="index" show-thumbnail />
    </ul>
  </div>
</template>
