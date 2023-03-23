<script setup lang="ts">
import filters from "@/utils/filters";
import { ref, Ref } from "vue";
import { PlaylistModel } from "@bcc-code/bmm-sdk-fetch";

import { list } from "@/api/playlists";
import { useAuth0 } from "@auth0/auth0-vue";

const playlists: Ref<PlaylistModel[]> = ref([]);

const { getAccessTokenSilently } = useAuth0();

list()
  .then(async (r) => {
    const token = await getAccessTokenSilently();
    playlists.value = r.map((p) => {
      // TODO: better solution for authorized urls
      const pl = p;
      pl.cover = filters.authorizedUrl(p.cover!, token);
      return pl;
    });
  })
  .catch(() => null /* TODO: implement error-handling */);
</script>

<template>
  <div class="flex flex-row flex-wrap">
    <RouterLink
      v-for="playlist in playlists"
      :key="playlist.id || 0"
      :to="{
        name: 'CuratedPlaylistDetails',
        params: { playlistId: playlist.id },
      }"
      class="m-4 text-ellipsis overflow-hidden w-52"
    >
      <img
        :src="filters.authorizedUrl(playlist.cover || '')"
        class="w-full aspect-square rounded-xl"
      />
      <span class="whitespace-nowrap">
        {{ playlist.title }}
      </span>
    </RouterLink>
  </div>
</template>
