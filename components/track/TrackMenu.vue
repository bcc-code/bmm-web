<script lang="ts" setup>
import type { NuxtIconName } from "#build//nuxt-icons";
import type { RoutesNamedLocations } from "#build/typed-router";
import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

const { t } = useI18n();
const { addNext, addToQueue } = useNuxtApp().$mediaPlayer;

defineProps<{
  track: TrackModel;
}>();

type DropdownMenuItem = {
  text: string;
  icon?: NuxtIconName;
} & ({ link: RoutesNamedLocations } | { clickFunction: Function });

const showInfo = ref(false);

const dropdownMenuItemsForTrack = (track: TrackModel) => {
  const items: DropdownMenuItem[] = [];

  items.push({
    icon: "icon.play",
    text: t("track.dropdown.play-next"),
    clickFunction: () => addNext(track),
  });

  if (track?.meta?.parent?.id) {
    items.push({
      icon: "icon.category.album",
      text: t("track.dropdown.go-to-album"),
      link: { name: "album-id", params: { id: track.meta.parent.id } },
    });
  }

  items.push({
    icon: "icon.queue",
    text: t("track.dropdown.add-to-queue"),
    clickFunction: () => addToQueue(track),
  });
  items.push({
    icon: "icon.category.playlist",
    text: t("track.dropdown.add-to-playlist"),
    link: { name: "browse" }, // TODO: change link
  });
  items.push({
    icon: "icon.share",
    text: t("track.dropdown.share"),
    link: { name: "browse" }, // TODO: change link
  });
  items.push({
    icon: "icon.person",
    text: t("track.dropdown.go-to-contributors"),
    link: { name: "browse" }, // TODO: change link
  });
  items.push({
    icon: "icon.information",
    text: t("track.dropdown.more-info"),
    clickFunction: () => {
      showInfo.value = true;
    },
  });

  return items;
};
</script>

<template>
  <Menu
    as="div"
    class="relative px-2 py-0 text-left ml-auto flex flex-col justify-center"
    @click.stop
  >
    <MenuButton
      as="button"
      :aria-label="t('track.a11y.options')"
      class="rounded-full mx-2 p-1 hover:bg-background-2"
    >
      <NuxtIcon name="options" class="text-xl" />
    </MenuButton>

    <MenuItems
      as="ul"
      class="absolute right-0 top-10 z-30 w-52 rounded-xl bg-white-1 p-1 shadow-md dark:bg-black-1"
    >
      <div class="py-0">
        <MenuItem
          v-for="item in dropdownMenuItemsForTrack(track)"
          :key="item.text"
          as="li"
          class="hover:text-black block w-full cursor-pointer rounded-lg hover:bg-background-2 hover:"
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
  <DialogBase :show="showInfo" title="Track Details" @close="showInfo = false">
    <TrackDetails :track="track"></TrackDetails>
  </DialogBase>
</template>
