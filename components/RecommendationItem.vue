<script lang="ts" setup>
import type { RecommendationModel } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();
const { setQueue } = useNuxtApp().$mediaPlayer;

defineProps<{
  item: RecommendationModel;
}>();
</script>

<template>
  <div class="col-span-full bg-background-2 rounded-2xl border-t-0">
    <div class="p-4">
      <div
        v-if="!item.title && !item.subtitle"
        class="text-[16px] font-semibold flex gap-1"
      >
        <NuxtIcon name="icon.fire" class="text-2xl" />
        {{ t("home.list.recommended") }}
      </div>
      <div v-if="item.title" class="text-[18px] font-semibold">
        {{ item.title }}
      </div>
      <div v-if="item.subtitle" class="text-[13px] font-medium text-label-3">
        {{ item.subtitle }}
      </div>
    </div>
    <div class="bg-background-1 m-1 px-4 rounded-xl container-shadow">
      <div class="w-full grid grid-cols-tracklist">
        <TrackItem
          v-if="item.track"
          :track="item.track"
          is-track-type-known
          show-thumbnail
          @play-track="setQueue([item.track])"
        />
        <GenericListItem
          v-else-if="item.album"
          :id="item.album.id"
          route-name="album-id"
          :cover="item.album.cover"
          :label="item.album.title"
        />
        <GenericListItem
          v-else-if="item.contributor"
          :id="item.contributor.id"
          route-name="playlist-contributor-id"
          :cover="item.contributor.cover"
          :label="item.contributor.name"
        />
        <GenericListItem
          v-else-if="item.playlist"
          :id="item.playlist.id"
          route-name="playlist-curated-id"
          :cover="item.playlist.cover"
          :label="item.playlist.title"
        />
      </div>
    </div>
  </div>
</template>
<style scoped>
.container-shadow {
  box-shadow:
    0px 2px 6px 0px #0000000d,
    0px 0px 3px 0px #0000000d,
    0px 0px 0px 1px #0000000a;
}
</style>
