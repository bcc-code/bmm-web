<script setup lang="ts">
import filters from "@/utils/filters";
import { ref, Ref } from "vue";
import { PlaylistModel } from "@bcc-code/bmm-sdk-fetch";

import { list } from "@/api/playlists";

const playlists: Ref<PlaylistModel[]> = ref([]);

list()
  .then((r) => {
    playlists.value = r;
  })
  .catch(/* TODO: implement error-handling */);
</script>

<template>
  <div id="example-1" class="covers">
    <div v-for="playlist in playlists" :key="playlist.id || 0" class="cover">
      <img
        :src="filters.authorizedUrl(playlist.cover || '')"
        width="214"
        height="214"
      />
      <span class="title">
        {{ playlist.title }}
      </span>
    </div>
  </div>
</template>
