<script lang="ts" setup>
import { GetTrackCollectionModel } from "@bcc-code/bmm-sdk-fetch";
import { ref } from "vue";
import { get } from "@/api/privatePlaylists";

const props = defineProps<{
  id: string;
}>();

const trackCollection = ref<GetTrackCollectionModel>({});

get(Number(props.id))
  .then((collection) => {
    trackCollection.value = collection;
  })
  .catch(() => {});
</script>

<template>
  <h2>{{ trackCollection?.name }}</h2>
  <ol class="list-decimal list-inside">
    <li v-for="track in trackCollection.tracks" :key="`track-${track.id}`">
      {{ track.title }}
    </li>
  </ol>
</template>

<style scoped>
h2 {
  width: 1368px;
  height: 32px;
  font-style: normal;
  font-weight: 800;
  font-size: 28px;
  line-height: 32px;
  letter-spacing: -0.3px;
  color: #0d131a;
  flex: none;
  order: 0;
  flex-grow: 1;
}
</style>
