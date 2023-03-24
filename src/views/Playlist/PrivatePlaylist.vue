<script lang="ts" setup>
import {
  Configuration,
  GetTrackCollectionModel,
  TrackCollectionApi,
} from "@bcc-code/bmm-sdk-fetch";
import { ref } from "vue";

const props = defineProps<{
  id: string;
}>();

const trackCollection = ref<GetTrackCollectionModel>({});

new TrackCollectionApi(
  new Configuration({
    basePath: import.meta.env.VITE_API_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Accept-Language": "nb,en,zxx",
    },
  })
)
  .trackCollectionIdGet({
    id: Number(props.id),
  })
  .then((collection) => {
    trackCollection.value = collection;
  })
  .catch(() => {});
</script>

<template>
  <h1>{{ trackCollection?.name }}</h1>
  <table>
    <ol class="list-decimal list-inside">
      <li v-for="track in trackCollection.tracks" :key="`track-${track.id}`">
        {{ track.title }}
      </li>
    </ol>
  </table>
</template>
