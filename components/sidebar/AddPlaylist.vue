<script lang="ts" setup>
const playlistName = ref("");
const showDialog = ref(false);

const show = () => {
  showDialog.value = true;
  playlistName.value = "";
};

const createPlaylist = async () => {
  if (playlistName.value === "") return;

  showDialog.value = false;
  try {
    const name = playlistName.value;
    playlistName.value = "";
    await addPrivatePlaylist(name);
    refreshPrivatePlaylists();
  } catch (e) {
    console.error(e);
    /* TODO: Define what should happen now... */
  }
};
</script>

<template>
  <div class="cursor-pointer px-4 py-2 text-label-3">
    <div class="group flex gap-2" @click="show()">
      <NuxtIcon name="icon.add" class="text-xl" />
      <span class="transition-transform group-hover:translate-x-2">
        {{ $t("playlist.add") }}
      </span>
    </div>
    <DialogBase
      :show="showDialog"
      :title="$t('playlist.new-playlist')"
      hide-button
      @close="showDialog = false"
    >
      <div class="flex flex-col gap-4">
        <input
          v-model="playlistName"
          class="min-w-[416px] grow rounded-lg bg-background-2 px-4 py-3 text-[17px] font-medium leading-7 text-label-1 placeholder:text-label-3"
          :placeholder="$t('playlist.name-your-playlist')"
        />
        <div class="flex grow gap-6">
          <ButtonStyled class="grow" @click.stop="showDialog = false">{{
            $t("global.cancel")
          }}</ButtonStyled>
          <ButtonStyled
            class="grow"
            :class="playlistName === '' ? 'opacity-50' : ''"
            intent="primary"
            @click.stop="createPlaylist()"
            >{{ $t("profile.done") }}</ButtonStyled
          >
        </div>
      </div>
    </DialogBase>
  </div>
</template>
