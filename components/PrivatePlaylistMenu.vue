<script lang="ts" setup>
import { TrackCollectionApi } from "@bcc-code/bmm-sdk-fetch";
import type { GetTrackCollectionModel } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();

const props = defineProps<{
  playlist: GetTrackCollectionModel;
}>();
const emit = defineEmits<{ "playlist-changed": [] }>();

const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const showAddToPlaylist = ref(false);
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

const dropdownMenuItems = computed(() => {
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
      text: t("playlist.action.remove-shared-playlist"),
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

  items.push({
    icon: "icon.category.playlist",
    text: t("track.dropdown.add-to-playlist"),
    clickFunction: () => {
      showAddToPlaylist.value = true;
    },
  });

  return items;
});

async function addToPlaylist(selectedPlaylist: number) {
  await new TrackCollectionApi().trackCollectionIdTrackCollectionPlaylistIdPost(
    {
      id: selectedPlaylist,
      playlistId: props.playlist.id,
    },
  );
}
</script>

<template>
  <DropdownMenu v-bind="$attrs" placement="bottom">
    <button
      :aria-label="t('track.a11y.options')"
      class="rounded-full bg-background-2 p-2 text-label-1"
    >
      <NuxtIcon name="options" class="text-2xl" />
    </button>

    <template #items>
      <DropdownMenuGroup>
        <DropdownMenuItem
          v-for="item in dropdownMenuItems"
          :key="item.text"
          :icon="item.icon"
          :title="item.text"
          @click="'clickFunction' in item && item.clickFunction()"
        >
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </template>
  </DropdownMenu>
  <DialogBase
    :show="showEditDialog"
    :title="$t('playlist.name-your-playlist')"
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

  <AddToPlaylist
    v-if="showAddToPlaylist"
    :list-selected="addToPlaylist"
    @close="showAddToPlaylist = false"
  />
</template>
