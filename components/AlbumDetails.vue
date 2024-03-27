<script lang="ts" setup>
import type { AlbumModel, TrackModel } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();

const props = defineProps<{
  albumId: number;
}>();

const albumId = Number(props.albumId);
const { data: album } = useAlbum({ id: albumId });

const expandedAlbum = ref<string | null>(null);

const toggleExpandedAlbum = (albumReference: string) => {
  if (expandedAlbum.value === albumReference) {
    expandedAlbum.value = null;
  } else {
    expandedAlbum.value = albumReference;
  }
};
const childAlbums = computed(
  () =>
    album.value?.children?.filter((c): c is AlbumModel => c.type === "album") ||
    [],
);
const childTracks = computed(
  () =>
    album.value?.children?.filter((c): c is TrackModel => c.type === "track") ||
    [],
);
</script>

<template>
  <div v-if="album" class="flex flex-col mb-[200px]">
    <header class="mb-12 flex gap-6">
      <div class="mt-10">
        <CoverImage
          :src="album.cover"
          class="aspect-square w-[240px] rounded-2xl"
        />
      </div>
      <div class="flex flex-col justify-between px-6 pt-4">
        <div>
          <PageHeading>{{ album.title }}</PageHeading>
        </div>
        <div class="flex gap-2">
          <CopyToClipboard
            :link="{
              name: 'album-id',
              params: { id: albumId },
            }"
          >
            <ButtonStyled icon="icon.link"></ButtonStyled>
          </CopyToClipboard>
        </div>
      </div>
    </header>
    <p v-if="album.children" class="py-2 text-label-3">
      <template v-if="childAlbums.length > 0">
        {{ t("collection.album-count", childAlbums.length) }}
      </template>
      <template v-else>
        {{ t("collection.track-count", childTracks.length) }}
      </template>
    </p>
    <TrackList :tracks="childTracks"> </TrackList>
    <template v-for="(child, i) in childAlbums" :key="`${child.id}-${i}`">
      <AlbumSubAlbum
        :id="child.id"
        :active="expandedAlbum === `${child.id}-${i}`"
        @expand="toggleExpandedAlbum(`${child.id}-${i}`)"
      ></AlbumSubAlbum>
    </template>
  </div>
</template>
