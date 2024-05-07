<script lang="ts" setup>
import type { AlbumModel, TrackModel } from "@bcc-code/bmm-sdk-fetch";
import getScrollParent from "~/utils/scroll";

const { t } = useI18n();

const props = defineProps<{
  album: AlbumModel;
}>();

const expandedAlbums = ref<string[]>([]);

const scrollToAlbum = (albumReference: string) => {
  const el = document.querySelector(`[data-album-id="${albumReference}"]`);
  const scrollParent = getScrollParent(el);

  if (!scrollParent || !el) return;

  const yInParent = el.getBoundingClientRect().top + scrollParent.scrollTop;
  const offsetPosition = yInParent - 100;

  scrollParent?.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};

const toggleExpandedAlbum = async (albumReference: string) => {
  if (expandedAlbums.value.includes(albumReference)) {
    expandedAlbums.value.splice(
      expandedAlbums.value.indexOf(albumReference),
      1,
    );
  } else {
    expandedAlbums.value.push(albumReference);
    await nextTick();
    scrollToAlbum(albumReference);
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
        :active="expandedAlbums.includes(`${child.id}-${i}`)"
        :data-album-id="`${child.id}-${i}`"
        @expand="toggleExpandedAlbum(`${child.id}-${i}`)"
      ></AlbumSubAlbum>
    </template>
  </div>
</template>
