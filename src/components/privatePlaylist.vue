<script setup lang="ts">
import { ref, Ref } from "vue";
import { TrackCollectionDetails } from "@bcc-code/bmm-sdk-fetch";
import { list } from "@/api/privatePlaylists";

const collections: Ref<TrackCollectionDetails[]> = ref([]);

list()
  .then((r) => {
    collections.value = r;
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.log(error);
  });
</script>

<template>
  <div>
    <h3>Playlists</h3>
    <RouterLink
      v-for="collection in collections"
      :key="collection.id || 0"
      :to="{
        name: 'PrivatePlaylist',
        params: { id: collection.id },
      }"
    >
      <ul>
        <li>
          {{ collection.name }}
        </li>
      </ul>
    </RouterLink>

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
