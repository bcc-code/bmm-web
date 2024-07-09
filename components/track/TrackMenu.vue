<script lang="ts" setup>
import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";

const runtimeConfig = useRuntimeConfig();
const { t } = useI18n();
const { $appInsights } = useNuxtApp();
const { addNext, addToQueue } = useNuxtApp().$mediaPlayer;

const copyToClipboardComponent = ref<null | { copyToClipboard: () => void }>(
  null,
);

const props = withDefaults(
  defineProps<{
    track: TrackModel;
    buttonClass?: string;
    addDropdownItems?: (items: DropdownMenuItem[], track: TrackModel) => void;
    origin?: string;
  }>(),
  {
    buttonClass: "",
    addDropdownItems: undefined,
  },
);

const showInfo = ref(false);
const showAddToPlaylist = ref(false);
const showContributorsList = ref(false);

const { download } = useWebDownload();
const showDownloadDialog = ref(false);

const dropdownMenuItemsForTrack = (track: TrackModel) => {
  const items: DropdownMenuItem[] = [];

  items.push({
    icon: "icon.play",
    text: t("track.dropdown.play-next"),
    clickFunction: () => addNext(track, props.origin),
  });
  items.push({
    icon: "icon.queue",
    text: t("track.dropdown.add-to-queue"),
    clickFunction: () => addToQueue(track, props.origin),
  });

  if (track?.meta?.parent?.id) {
    items.push({
      icon: "icon.category.album",
      text: t("track.dropdown.go-to-album"),
      link: { name: "album-id", params: { id: track.meta.parent.id } },
    });
  }

  if (runtimeConfig.public.systemName !== "Electron") {
    items.push({
      icon: "icon.download",
      text: t("track.dropdown.download"),
      clickFunction: async () => {
        const result = await download(track);
        if (result === "no-permission") {
          $appInsights.event("denied downloading track", { trackId: track.id });
          showDownloadDialog.value = true;
        } else {
          $appInsights.event("track downloaded", { trackId: track.id });
        }
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
      if (track.contributors && uniqueItems(track.contributors).length > 1) {
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

  if (props.addDropdownItems) {
    props.addDropdownItems(items, track);
  }

  return items;
};
</script>

<template>
  <DropdownMenu placement="bottom-end" v-bind="$attrs" @click.stop>
    <button
      :aria-label="t('track.a11y.options')"
      class="rounded-full p-1 hover:bg-background-2 hover:text-label-1"
      :class="buttonClass"
    >
      <NuxtIcon name="options" class="text-xl" />
    </button>

    <template #items>
      <DropdownMenuGroup>
        <DropdownMenuItem
          v-for="item in dropdownMenuItemsForTrack(track)"
          :key="item.text"
          :icon="item.icon"
          :title="item.text"
          :to="'link' in item ? item.link : undefined"
          @click="'clickFunction' in item ? item.clickFunction() : undefined"
        />
      </DropdownMenuGroup>
    </template>
  </DropdownMenu>

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
  <DialogDownloadNotAllowed
    :show="showDownloadDialog"
    @close="showDownloadDialog = false"
  />
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
