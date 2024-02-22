<script lang="ts" setup>
const emit = defineEmits<{ "reload-playlists": [] }>();

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
    await addPrivatePlaylist(playlistName.value);
    playlistName.value = "";
    emit("reload-playlists");
  } catch (e) {
    console.error(e);
    /* TODO: Define what should happen now... */
  }
};
</script>

<template>
  <div class="px-4 py-2 cursor-pointer text-label-3">
    <div class="group gap-2 flex" @click="show()">
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
          class="text-[17px] min-w-[416px] grow leading-7 placeholder:text-label-3 text-label-1 font-medium bg-background-2 px-4 py-3 rounded-lg"
          :placeholder="$t('playlist.name-your-playlist')"
        />
        <div class="flex gap-6 grow">
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
