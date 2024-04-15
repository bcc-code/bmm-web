<script lang="ts" setup>
import { TrackCollectionApi } from "@bcc-code/bmm-sdk-fetch";
import type { GetTrackCollectionModel } from "@bcc-code/bmm-sdk-fetch";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    playlist: GetTrackCollectionModel;
    buttonClass?: string;
  }>(),
  {
    buttonClass: "",
  },
);
const emit = defineEmits<{ "playlist-changed": [] }>();

const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const playlistName = ref("");

const savePlaylist = async () => {
  try {
    showEditDialog.value = false;
    await new TrackCollectionApi().trackCollectionIdPut({
      id: props.playlist.id,
      updateTrackCollectionCommand: {
        id: props.playlist.id,
        name: playlistName.value,
        trackReferences: tracksToTrackReferences(props.playlist.tracks),
      },
    });
    emit("playlist-changed");
    refreshPrivatePlaylists();
  } catch (e) {
    // TODO: Show an error message to the user
    console.error(e);
  }
};
const deletePlaylist = async () => {
  try {
    navigateTo();
    await new TrackCollectionApi().trackCollectionIdDelete({
      id: props.playlist.id,
    });
    refreshPrivatePlaylists();
  } catch (e) {
    // TODO: Show an error message to the user
    console.error(e);
  }
};

const dropdownMenuItems = () => {
  const items: DropdownMenuItem[] = [];

  if (props.playlist.canEdit) {
    items.push({
      icon: "icon.comment",
      text: t("edit.rename"),
      clickFunction: () => {
        playlistName.value = props.playlist.name || "";
        showEditDialog.value = true;
      },
    });
    items.push({
      icon: "icon.close.small",
      text: t("edit.delete"),
      clickFunction: () => (showDeleteDialog.value = true),
    });
  } else {
    items.push({
      icon: "icon.close.small",
      text: "Remove playlist",
      clickFunction: async () => {
        const api = new TrackCollectionApi();
        await api.trackCollectionIdUnfollowPost({
          id: props.playlist.id,
        });
        navigateTo();
        refreshPrivatePlaylists();
      },
    });
  }

  return items;
};
</script>

<template>
  <Menu
    as="div"
    class="relative flex flex-col justify-center text-left"
    :class="$attrs.class"
    @click.stop
  >
    <MenuButton
      as="button"
      :aria-label="t('track.a11y.options')"
      class="rounded-full bg-background-2 p-2 text-label-1"
      :class="buttonClass"
    >
      <NuxtIcon name="options" class="text-2xl" />
    </MenuButton>

    <MenuItems
      as="ul"
      class="absolute left-[-100px] right-[-100px] top-12 z-30 mx-auto whitespace-nowrap rounded-xl bg-background-3 p-1 shadow-[0_4px_12px_0_#0000000D,0_1px_4px_0_#0000000D,0_0_0_1px_#0000000D]"
    >
      <div class="py-0">
        <MenuItem
          v-for="item in dropdownMenuItems()"
          :key="item.text"
          as="li"
          class="hover:text-black block w-full cursor-pointer rounded-lg text-label-1 hover:bg-background-2"
        >
          <NuxtLink
            v-if="'link' in item"
            class="flex w-full items-center justify-start gap-2 px-3 py-2"
            :to="item.link"
          >
            <NuxtIcon v-if="item.icon" :name="item.icon" />
            <span>{{ item.text }}</span>
          </NuxtLink>
          <button
            v-else
            class="flex w-full items-center justify-start gap-2 px-3 py-2"
            @click="item.clickFunction?.()"
          >
            <NuxtIcon v-if="item.icon" :name="item.icon" />
            <span>{{ item.text }}</span>
          </button>
        </MenuItem>
      </div>
    </MenuItems>
  </Menu>
  <DialogBase
    :show="showEditDialog"
    :title="$t('playlist.new-playlist')"
    hide-button
    @close="showEditDialog = false"
  >
    <div class="flex flex-col gap-4">
      <input
        v-model="playlistName"
        class="min-w-[416px] grow rounded-lg bg-background-2 px-4 py-3 text-[17px] font-medium leading-7 text-label-1 placeholder:text-label-3"
        :placeholder="$t('playlist.name-your-playlist')"
      />
      <div class="flex grow gap-6">
        <ButtonStyled class="grow" @click.stop="showEditDialog = false">{{
          $t("global.cancel")
        }}</ButtonStyled>
        <ButtonStyled
          class="grow"
          :class="playlistName === '' ? 'opacity-50' : ''"
          intent="primary"
          @click.stop="savePlaylist()"
          >{{ $t("profile.done") }}</ButtonStyled
        >
      </div>
    </div>
  </DialogBase>
  <DialogBase
    :show="showDeleteDialog"
    :title="$t('playlist.delete-playlist')"
    :description="$t('playlist.delete-playlist-description')"
    hide-button
    @close="showDeleteDialog = false"
  >
    <div class="flex flex-col gap-4">
      <div class="flex grow gap-6">
        <ButtonStyled class="grow" @click.stop="showDeleteDialog = false">{{
          $t("global.cancel")
        }}</ButtonStyled>
        <ButtonStyled
          class="grow"
          intent="primary"
          @click.stop="deletePlaylist()"
          >{{ $t("profile.done") }}</ButtonStyled
        >
      </div>
    </div>
  </DialogBase>
</template>
