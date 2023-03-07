<script setup lang="ts">
import { ref, Ref } from "vue";
import { PlaylistApi, PlaylistModel, Configuration } from "../../generated/api/index";

const playlists: Ref<PlaylistModel[]> = ref([]);

const accessToken = (import.meta.env.VITE_BMM_TOKEN as string);

new PlaylistApi(
  new Configuration({
    basePath: "https://int-bmm-api.brunstad.org",
    headers: {
      Authorization: import.meta.env.VITE_BMM_TOKEN,
      "Accept-Language": "nb,en,zxx",
    },
  })
)
  .playlistGet()
  .then((list) => {
    playlists.value = list;
  })
  .catch(() => {});

const count = ref(0);
</script>

<template>
  <div id="example-1" class="covers">
    <div v-for="playlist in playlists" :key="playlist.id" class="cover">
      <img v-bind:src="playlist.cover + '&auth=' + accessToken" width="214" height="214" />
      <span class="title">
        {{ playlist.title }}
      </span>
    </div>
  </div>


</template>
