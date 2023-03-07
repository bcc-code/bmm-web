<script setup lang="ts">
import config from "@/config"
import { ref, Ref } from "vue";
import { PlaylistApi, PlaylistModel, Configuration } from "../../generated/api/index";

const playlists: Ref<PlaylistModel[]> = ref([]);

new PlaylistApi(
  new Configuration({
    basePath: config.apiUrl,
    headers: {
      Authorization: config.bmmToken,
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
      <img :src="playlist.cover + '&auth=' + config.bmmToken" width="214" height="214" />
      <span class="title">
        {{ playlist.title }}
      </span>
    </div>
  </div>


</template>
