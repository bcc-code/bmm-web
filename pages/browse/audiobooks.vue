<script lang="ts" setup>
import { useInfiniteScroll } from "@vueuse/core";

const { data: models, pending } = useBrowseAudiobooks();
setTitleOfDocumentList(models);

const data = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);

onMounted(() => {
  const main = ref<HTMLElement | null>(document.querySelector("main"));
  console.log("mounted now", main.value, main.value?.clientHeight);

  console.log("setup infinite scroll", main.value?.clientHeight);
  useInfiniteScroll(
    main,
    () => {
      console.log("load more");
      // load more
      //return;
      const length = data.value.length + 1;
      data.value.push(...Array.from({ length: 5 }, (_, i) => length + i));
    },
    { distance: 10 },
  );
});
</script>

<template>
  <div class="m-10">
    <div v-for="item in data" class="p-10">
      {{ item }}
    </div>
  </div>
</template>
