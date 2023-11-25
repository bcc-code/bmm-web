<script lang="ts" setup>
const showInput = ref(false);
const playlistName = ref("");

const toggleInput = () => {
  playlistName.value = "";
  showInput.value = !showInput.value;
};

const savePlaylist = async () => {
  try {
    await addPrivatePlaylist(playlistName.value);
    toggleInput();
    // TODO: Trigger a reload of the list of playlists
  } catch (e) {
    console.log(e);
    /* TODO: Define what should happen now... */
  }
};
</script>

<template>
  <div class="px-4 py-2 cursor-pointer text-label-3">
    <div v-if="!showInput" class="group gap-2 flex" @click="toggleInput()">
      <NuxtIcon name="icon.add" class="text-xl" />
      <span class="transition-transform group-hover:translate-x-2">
        {{ $t("playlist.add") }}
      </span>
    </div>
    <div v-else class="group gap-2 flex">
      <NuxtIcon name="icon.close" class="text-xl" @click="toggleInput()" />
      <span class="w-full">
        <input v-model="playlistName" class="w-full" />
      </span>
      <NuxtIcon name="icon.checkmark" class="text-xl" @click="savePlaylist()" />
    </div>
  </div>
</template>
