<script lang="ts" setup>
import type { NuxtIconName } from "#build//nuxt-icons";
import type { RoutesNamedLocations } from "#build/typed-router";
import { TrackCollectionApi } from "@bcc-code/bmm-sdk-fetch";
import type {
  GetTrackCollectionModel,
  TrackModel,
  TrackReference,
} from "@bcc-code/bmm-sdk-fetch";
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

type DropdownMenuItem = {
  text: string;
  icon?: NuxtIconName;
} & ({ link: RoutesNamedLocations } | { clickFunction: Function });

const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const playlistName = ref("");

const tracksToTrackReferences = (tracks: TrackModel[] | undefined | null) => {
  const list: TrackReference[] = [];
  if (!tracks) return list;

  tracks.forEach((track) => {
    if (track.id && track.language)
      list.push({
        id: track.id,
        language: track.language,
      });
  });
  return list;
};

const savePlaylist = async () => {
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
};
const deletePlaylist = async () => {
  navigateTo();
  await new TrackCollectionApi().trackCollectionIdDelete({
    id: props.playlist.id,
  });
  refreshPrivatePlaylists();
};

const dropdownMenuItems = () => {
  const items: DropdownMenuItem[] = [];

  items.push({
    // icon: "icon.ai", // ToDo: get comment icon
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

  return items;
};
</script>

<template>
  <Menu
    as="div"
    class="relative text-left flex flex-col justify-center"
    :class="$attrs.class"
    @click.stop
  >
    <MenuButton
      as="button"
      :aria-label="t('track.a11y.options')"
      class="rounded-full p-2 bg-background-2 text-label-1"
      :class="buttonClass"
    >
      <NuxtIcon name="options" class="text-2xl" />
    </MenuButton>

    <MenuItems
      as="ul"
      class="absolute right-[-100px] left-[-100px] mx-auto top-12 z-30 w-52 rounded-xl p-1 bg-background-3 shadow-[0_4px_12px_0_#0000000D,0_1px_4px_0_#0000000D,0_0_0_1px_#0000000D]"
    >
      <div class="py-0">
        <MenuItem
          v-for="item in dropdownMenuItems()"
          :key="item.text"
          as="li"
          class="block w-full cursor-pointer rounded-lg text-label-1 hover:bg-background-2 hover:text-black"
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
        class="text-[17px] min-w-[416px] grow leading-7 placeholder:text-label-3 text-label-1 font-medium bg-background-2 px-4 py-3 rounded-lg"
        :placeholder="$t('playlist.name-your-playlist')"
      />
      <div class="flex gap-6 grow">
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
      <div class="flex gap-6 grow">
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
