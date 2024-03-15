<script lang="ts" setup>
import { useInfiniteScroll } from "@vueuse/core";

const { data: models, pending } = useBrowseAudiobooks();
setTitleOfDocumentList(models);

const data = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
const main = ref<HTMLElement | null>(document.querySelector("main"));

useInfiniteScroll(
  main,
  () => {
    // load more
    //return;
    const length = data.value.length + 1;
    data.value.push(...Array.from({ length: 5 }, (_, i) => length + i));
  },
  { distance: 10 },
);
</script>

<template>
  <div ref="el" class="bg-tint m-10">
    <div v-for="item in data" class="p-10">
      {{ item }}
    </div>
  </div>
</template>
