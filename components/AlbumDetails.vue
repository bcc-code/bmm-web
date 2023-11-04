<script lang="ts" setup>
import { AlbumModel, TrackModel } from "@bcc-code/bmm-sdk-fetch";

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
      <ProtectedImage
        v-if="album.cover"
        :src="album.cover"
        alt=""
        class="bg-slate-100 aspect-square w-[300px] rounded-2xl"
      />
      <div class="flex flex-col justify-between p-6">
        <div>
          <PageHeading :level="2">{{ album.title }}</PageHeading>
        </div>
      </div>
    </header>
    <p v-if="album.children" class="p-2">
      {{ t("collection.album-count", album.children.length) }}
    </p>
    <TrackList
      :tracks="(album?.children?.filter((c) : c is TrackModel => c.type === 'track') || [])"
    >
    </TrackList>
    <div
      v-for="(child, i) in album?.children?.filter((c) : c is AlbumModel => c.type === 'album')"
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
