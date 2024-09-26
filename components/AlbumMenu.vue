<script lang="ts" setup>
import { TrackCollectionApi } from "@bcc-code/bmm-sdk-fetch";
import type { AlbumModel } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();

const props = defineProps<{
  album: AlbumModel;
}>();

const showAddToPlaylist = ref(false);

const dropdownMenuItems = () => {
  const items: DropdownMenuItem[] = [];

  items.push({
    icon: "icon.category.playlist",
    text: t("track.dropdown.add-to-playlist"),
    clickFunction: () => {
      showAddToPlaylist.value = true;
    },
  });

  return items;
};

async function addToPlaylist(selectedPlaylist: number) {
  await new TrackCollectionApi().trackCollectionIdAlbumAlbumIdPost({
    id: selectedPlaylist,
    albumId: props.album.id,
  });
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
          v-for="item in dropdownMenuItems()"
          :key="item.text"
          :icon="item.icon"
          :title="item.text"
          @click="'clickFunction' in item && item.clickFunction()"
        >
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </template>
  </DropdownMenu>

  <AddToPlaylist
    v-if="showAddToPlaylist"
    :list-selected="addToPlaylist"
    @close="showAddToPlaylist = false"
  />
</template>
