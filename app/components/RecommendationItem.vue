<script lang="ts" setup>
import type { RecommendationModel } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();
const { setQueue } = useNuxtApp().$mediaPlayer;

defineProps<{
  item: RecommendationModel;
}>();
</script>

<template>
  <div class="col-span-full rounded-2xl border-t-0 bg-background-2">
    <div class="p-4">
      <div
        v-if="!item.title && !item.subtitle"
        class="flex gap-1 text-[16px] font-semibold"
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
    <div class="container-shadow m-1 rounded-xl bg-background-1 px-4">
      <div class="grid w-full grid-cols-tracklist">
        <TrackItem
          v-if="item.track"
          :track="item.track"
          is-track-type-known
          show-thumbnail
          @play-track="setQueue([item.track])"
        />
        <GenericListItem
          v-else-if="item.album"
          :route="{ name: 'album-id', params: { id: item.album.id } }"
          :cover="item.album.cover"
          :label="item.album.title"
        />
        <GenericListItem
          v-else-if="item.contributor"
          :route="{
            name: 'playlist-contributor-id',
            params: { id: item.contributor.id },
          }"
          :cover="item.contributor.cover"
          :label="item.contributor.name"
        />
        <GenericListItem
          v-else-if="item.playlist"
          :route="{
            name: 'playlist-curated-id',
            params: { id: item.playlist.id },
          }"
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
