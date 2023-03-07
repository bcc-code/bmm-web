<script setup lang="ts">
import { ref, Ref } from "vue";
import { PlaylistApi, PlaylistModel, Configuration } from "../../generated/api/index";

const playlists: Ref<PlaylistModel[]> = ref([]);
const authToken = import.meta.env.VITE_BMM_TOKEN;

new PlaylistApi(
  new Configuration({
    basePath: import.meta.env.VITE_API_URL,
    headers: {
      Authorization: authToken,
      "Accept-Language": "nb,en,zxx",
    },
  })
)
  .playlistGet()
  .then((list) => {
    playlists.value = list;
  })
  .catch(() => {});

</script>

<template>
  <div id="example-1" class="covers">
    <div v-for="playlist in playlists" :key="playlist.id" class="cover">
      <img :src="playlist.cover + '&auth=' + authToken" width="214" height="214" />
      <span class="title">
        {{ playlist.title }}
      </span>
    </div>
  </div>


</template>
