<script lang="ts" setup>
import type { NuxtIconName } from "#build//nuxt-icons";
import type { RoutesNamedLocations } from "#build/typed-router";
import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

const { t } = useI18n();
const { addNext, addToQueue } = useNuxtApp().$mediaPlayer;

const copyToClipboardComponent = ref<null | { copyToClipboard: () => void }>(
  null,
);

withDefaults(
  defineProps<{
    track: TrackModel;
    buttonClass?: string;
  }>(),
  {
    buttonClass: "",
  },
);

type DropdownMenuItem = {
  text: string;
  icon?: NuxtIconName;
} & ({ link: RoutesNamedLocations } | { clickFunction: Function });

const showInfo = ref(false);
const showAddToPlaylist = ref(false);
const showContributorsList = ref(false);

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
    clickFunction: () => {
      showAddToPlaylist.value = true;
    },
  });

  items.push({
    icon: "icon.share",
    text: t("track.dropdown.share"),
    clickFunction: () => {
      copyToClipboardComponent?.value?.copyToClipboard?.();
    },
  });

  items.push({
    icon: "icon.person",
    text: t("track.dropdown.go-to-contributors"),
    clickFunction: () => {
      if (track.contributors && track.contributors.length > 1) {
        showContributorsList.value = true;
      } else if (track.contributors?.[0]?.id) {
        navigateTo({
          name: "playlist-contributor-id",
          params: { id: track.contributors[0].id },
        });
      }
    },
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
    class="relative flex flex-col justify-center text-left"
    :class="$attrs.class"
    @click.stop
  >
    <MenuButton
      as="button"
      :aria-label="t('track.a11y.options')"
      class="rounded-full p-1 hover:bg-background-2 hover:text-label-1"
      :class="buttonClass"
    >
      <NuxtIcon name="options" class="text-xl" />
    </MenuButton>

    <MenuItems
      as="ul"
      class="absolute right-0 top-10 z-30 whitespace-nowrap rounded-xl bg-background-3 p-1 shadow-[0_4px_12px_0_#0000000D,0_1px_4px_0_#0000000D,0_0_0_1px_#0000000D]"
    >
      <div class="py-0">
        <MenuItem
          v-for="item in dropdownMenuItemsForTrack(track)"
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
  <DialogBase :show="showInfo" title="Track Details" @close="showInfo = false">
    <TrackDetails
      class="md:w-[500px] lg:w-[600px]"
      :track="track"
    ></TrackDetails>
  </DialogBase>
  <DialogBase
    :show="showContributorsList"
    :title="t('track.dropdown.go-to-contributors')"
    @close="showContributorsList = false"
  >
    <TrackContributors :track="track"></TrackContributors>
  </DialogBase>
  <CopyToClipboard
    ref="copyToClipboardComponent"
    :link="{ name: 'track-id', params: { id: track.id } }"
  ></CopyToClipboard>
  <TrackAddToPlaylist
    v-if="showAddToPlaylist"
    :track-id="track.id"
    @close="showAddToPlaylist = false"
  ></TrackAddToPlaylist>
</template>
