<script setup lang="ts">
// import filters from "@/utils/filters";
import { ref, Ref } from "vue";
import {
  TrackCollectionApi,
  TrackCollectionDetails,
  Configuration,
} from "@bcc-code/bmm-sdk-fetch";

const collections: Ref<TrackCollectionDetails[]> = ref([]);

new TrackCollectionApi(
  new Configuration({
    basePath: import.meta.env.VITE_API_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Accept-Language": "nb,en,zxx",
    },
  })
)
  .trackCollectionGet()
  .then((list) => {
    collections.value = list;
  })
  .catch(() => {});
</script>

<template>
  <div>
    <h3>Playlists</h3>
    <ul>
      <li v-for="collection in collections" :key="collection.id || 0">
        <a href="">{{ collection.name }}</a>
      </li>
    </ul>

    <input
      class="placeholder placeholder:text-gray-500 w-full bg-gray-100 py-2 sm:text-sm"
      placeholder="+ Add playlist"
      type="text"
    />
  </div>
</template>

<style scoped>
div h3 {
  /* line-height: 20px; */
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  letter-spacing: -0.3px;
  padding-bottom: 5px;
  color: #757b80;
  flex: none;
  order: 0;
  flex-grow: 1;
}
div a {
  display: block;
  font-style: normal;
  font-weight: 500;
  font-size: 17px;
  padding-bottom: 30px;
  width: 200px;
  height: 24px;
  color: #0d131a;
}
</style>
