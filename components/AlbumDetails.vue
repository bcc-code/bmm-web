<script lang="ts" setup>
import type { AlbumModel, TrackModel } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();

const props = defineProps<{
  album: AlbumModel;
}>();

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
    props.album.children?.filter((c): c is AlbumModel => c.type === "album") ||
    [],
);
const childTracks = computed(
  () =>
    props.album.children?.filter((c): c is TrackModel => c.type === "track") ||
    [],
);
</script>

<template>
  <div v-if="album" class="mb-[200px] flex flex-col">
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
              params: { id: album.id },
            }"
          >
            <ButtonStyled icon="icon.link"></ButtonStyled>
          </CopyToClipboard>
        </div>
      </div>
    </header>
    <p v-if="childTracks.length" class="py-2 text-label-3">
      {{ t("collection.track-count", childTracks.length) }}
    </p>
    <TrackList :tracks="childTracks"> </TrackList>
    <p
      v-if="childAlbums.length"
      class="py-2 text-label-3"
      :class="{ 'mt-6': childAlbums.length }"
    >
      {{ t("collection.album-count", childAlbums.length) }}
    </p>
    <template v-for="(child, i) in childAlbums" :key="`${child.id}-${i}`">
      <AlbumSubAlbum
        :id="child.id"
        :active="expandedAlbum === `${child.id}-${i}`"
        @expand="toggleExpandedAlbum(`${child.id}-${i}`)"
      ></AlbumSubAlbum>
    </template>
  </div>
</template>
