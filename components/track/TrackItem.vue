<script lang="ts" setup>
import type { NuxtIconName } from "~/.nuxt/nuxt-icons";
import type { RoutesNamedLocations } from "~/.nuxt/typed-router";
import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

const { t } = useI18n();

const { addNext, addToQueue } = useNuxtApp().$mediaPlayer;

defineProps<{
  track: TrackModel;
  showThumbnail?: boolean;
  isTrackTypeKnown: boolean;
}>();

type DropdownMenuItem = {
  text: string;
  icon?: NuxtIconName;
} & ({ link: RoutesNamedLocations } | { clickFunction: Function });

defineSlots<{
  default: (props: {}) => any;
}>();

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

const emit = defineEmits<{ "play-track": [] }>();

function playTrack() {
  emit("play-track");
}

function secondsToTime(totalSeconds: number | undefined) {
  if (totalSeconds === undefined) return "";
  const minutes = Math.ceil(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
</script>

<template>
  <li class="group relative mr-3 cursor-pointer py-3" @click.stop="playTrack">
    <div
      class="absolute -inset-x-4 -inset-y-0 rounded-xl bg-background-2 opacity-0 group-hover:opacity-100"
    ></div>
    <div class="relative flex items-center justify-between gap-3">
      <div
        v-if="track.meta?.attachedPicture && showThumbnail"
        class="relative w-10"
      >
        <ProtectedImage
          :src="track.meta?.attachedPicture"
          alt=""
          class="aspect-square w-10 rounded-md bg-background-2"
        />
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100">
          <div
            class="absolute inset-0 h-full w-full rounded-md bg-black-1 opacity-50 dark:bg-white-1"
          ></div>
          <NuxtIcon
            name="play"
            class="absolute inset-0 flex items-center justify-center text-2xl text-white-1 dark:text-black-1"
          />
        </div>
      </div>
      <div class="mr-auto w-1/3">
        <h4
          class="overflow-hidden text-ellipsis whitespace-nowrap font-semibold"
          :title="track.meta?.title || ''"
        >
          {{ track.meta?.title }}
        </h4>
        <span
          v-if="track.meta?.artist"
          :title="track.meta?.artist"
          class="block overflow-hidden text-ellipsis whitespace-nowrap text-label-1"
        >
          {{ track.meta?.artist }}
        </span>
      </div>
      <div
        v-if="!(track.meta?.attachedPicture && showThumbnail)"
        class="block h-1 w-10"
      ></div>
      <div v-if="!isTrackTypeKnown">
        <span class="text-label-2">{{ track.subtype }}</span>
      </div>
      <div v-if="isTrackTypeKnown">
        <span class="text-label-2">{{ track.meta?.album }}</span>
      </div>
      <div class="ml-auto">
        <span class="text-label-2">{{
          secondsToTime(track.media?.[0]?.files?.[0]?.duration)
        }}</span>
      </div>
      <div class="ml-auto flex items-center justify-center gap-1">
        <button
          class="px-2 py-0 opacity-0 hover:bg-[red] hover:opacity-100 focus:opacity-100 group-hover:opacity-100 group-focus:opacity-100"
          :aria-label="t('track.a11y.download')"
          @click.stop
        >
          <NuxtIcon name="download" class="text-2xl" />
        </button>
        <button
          class="px-2 py-0 opacity-0 hover:bg-[red] hover:opacity-100 focus:opacity-100 group-hover:opacity-100 group-focus:opacity-100"
          :aria-label="t('track.a11y.queue')"
          @click.stop
        >
          <NuxtIcon name="queue" class="text-2xl" />
        </button>
        <Menu
          as="div"
          class="relative inline-block px-2 py-0 text-left"
          @click.stop
        >
          <MenuButton
            as="button"
            :aria-label="t('track.a11y.options')"
            class="relative top-0.5 rounded-lg px-2 py-0"
          >
            <NuxtIcon name="options" class="text-2xl" />
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
      </div>
    </div>
    <DialogBase
      :show="showInfo"
      title="Track Details"
      @close="showInfo = false"
    >
      <TrackDetails :track="track"></TrackDetails>
    </DialogBase>
    <slot />
  </li>
</template>
