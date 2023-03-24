<script lang="ts" setup>
import {
  Configuration,
  GetTrackCollectionModel,
  TrackCollectionApi,
} from "@bcc-code/bmm-sdk-fetch";
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
  <h1>{{ trackCollection?.name }}</h1>
  <ol class="list-decimal list-inside">
    <li v-for="track in trackCollection.tracks" :key="`track-${track.id}`">
      {{ track.title }}
    </li>
  </ol>
</template>
