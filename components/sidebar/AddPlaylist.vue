<script lang="ts" setup>
const playlistName = ref("");
const showDialog = ref(false);

const show = () => {
  showDialog.value = true;
  playlistName.value = "";
};
const hide = () => {
  showDialog.value = false;
  playlistName.value = "";
};

const saving = ref(false);
const createPlaylist = async () => {
  if (!playlistName.value?.length) return;

  saving.value = true;
  try {
    await addPrivatePlaylist(playlistName.value);
    refreshPrivatePlaylists();
  } catch (e) {
    console.error(e);
    /* TODO: Define what should happen now... */
  } finally {
    hide();
    saving.value = false;
  }
};
</script>

<template>
  <div class="cursor-pointer px-4 py-2 text-label-3">
    <button class="group flex gap-2" @click="show">
      <NuxtIcon name="icon.add" class="text-xl" />
      <span class="transition-transform group-hover:translate-x-2">
        {{ $t("playlist.add") }}
      </span>
    </button>
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
          @keydown.enter="createPlaylist"
        />
        <div class="flex grow gap-6">
          <ButtonStyled class="grow" @click.stop="hide">
            {{ $t("global.cancel") }}
          </ButtonStyled>
          <ButtonStyled
            :class="['grow']"
            intent="primary"
            :loading="saving"
            :disabled="playlistName === ''"
            @click="createPlaylist"
          >
            {{ $t("profile.done") }}
          </ButtonStyled>
        </div>
      </div>
    </DialogBase>
  </div>
</template>
