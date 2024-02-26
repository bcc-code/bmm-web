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
</script>

<template>
  <div v-if="album">
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
            <ButtonStyled intent="secondary" class="h-full aspect-square">
              <NuxtIcon name="icon.link" />
            </ButtonStyled>
          </CopyToClipboard>
        </div>
      </div>
    </header>
    <p v-if="album.children" class="p-2">
      {{ t("collection.album-count", album.children.length) }}
    </p>
    <TrackList
      :tracks="
        album?.children?.filter((c): c is TrackModel => c.type === 'track') ||
        []
      "
    >
    </TrackList>
    <div
      v-for="(child, i) in album?.children?.filter(
        (c): c is AlbumModel => c.type === 'album',
      )"
      :key="`${child.id}-${i}`"
    >
      <AlbumSubAlbum
        :id="child.id"
        :active="expandedAlbum === `${child.id}-${i}`"
        @expand="toggleExpandedAlbum(`${child.id}-${i}`)"
      ></AlbumSubAlbum>
    </div>
  </div>
</template>
