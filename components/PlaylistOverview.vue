<script setup lang="ts">
const { playlists, error } = usePlaylists();
</script>

<template>
  <div class="flex flex-row flex-wrap">
    <NuxtLink
      v-for="playlist in playlists"
      :key="playlist.id || 0"
      :to="`/playlist/${playlist.id}`"
      class="m-4 text-ellipsis overflow-hidden w-52"
    >
      <ProtectedImage
        v-if="playlist.cover"
        :src="playlist.cover"
        class="w-full aspect-square rounded-xl"
      />
      <span class="whitespace-nowrap">
        {{ playlist.title }}
      </span>
    </NuxtLink>
  </div>
</template>
