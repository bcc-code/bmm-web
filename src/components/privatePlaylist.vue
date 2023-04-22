<script setup lang="ts">
import { ref, Ref } from "vue";
import {
  TrackCollectionDetails,
  TrackCollectionApi,
} from "@bcc-code/bmm-sdk-fetch";

const collections: Ref<TrackCollectionDetails[]> = ref([]);

new TrackCollectionApi()
  .trackCollectionGet()
  .then((r) => {
    collections.value = r;
  })
  .catch(() => {});
</script>

<template>
  <div>
    <h3>{{ $t("nav.playlist") }}</h3>
    <ul>
      <li
        v-for="collection in collections"
        :key="collection.id || 0"
        class="flex"
      >
        <RouterLink
          :to="{
            name: 'PrivatePlaylist',
            params: { id: collection.id },
          }"
        >
          <span class="flex">
            <img
              src=".././assets/Icons/icon.category.playlist.svg"
              alt="playlist"
              class="pr-1"
            />
            {{ collection.name }}
          </span>
        </RouterLink>
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
