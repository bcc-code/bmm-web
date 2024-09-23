<script lang="ts" setup>
import type { AlbumModel, TrackModel } from "@bcc-code/bmm-sdk-fetch";
import getScrollParent from "~/utils/scroll";

const { t } = useI18n();
const { setQueue } = useNuxtApp().$mediaPlayer;

const props = defineProps<{
  album: AlbumModel;
}>();

const origin = computed(() => `Album|${props.album.id}`);
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
const onPressPlay = () => {
  if (childTracks.value) {
    setQueue(childTracks.value, 0, origin.value);
  }
};
const onResume = () => {
  if (childTracks.value) {
    const index = childTracks.value.findIndex(
      (track) => track.id === props.album.latestTrackId,
    );
    setQueue(
      childTracks.value,
      index,
      origin.value,
      props.album.latestTrackPosition
        ? props.album.latestTrackPosition / 1000
        : 0,
    );
  }
};
</script>

<template>
  <div v-if="album" class="mb-[200px] flex flex-col">
    <TrackCollectionHeader>
      <template #cover>
        <CoverImage :src="album.cover" class="rounded-2xl" />
      </template>
      <template #heading>
        <PageHeading>{{ album.title }}</PageHeading>
      </template>
      <template #actions>
        <ButtonStyled
          v-if="childTracks.length >= 1"
          intent="primary"
          icon="icon.play"
          @click="onPressPlay()"
        >
          {{ t("podcast.action.play") }}
        </ButtonStyled>
        <ButtonStyled
          v-if="childTracks.length >= 1 && album.latestTrackId"
          intent="primary"
          icon="icon.play"
          @click="onResume()"
        >
          {{ t("collection.resume") }}
        </ButtonStyled>
        <CopyToClipboard
          :link="{
            name: 'album-id',
            params: { id: album.id },
          }"
        >
          <ButtonStyled icon="icon.link"></ButtonStyled>
        </CopyToClipboard>
      </template>
    </TrackCollectionHeader>

    <p v-if="childTracks.length" class="py-2 text-label-3">
      {{ t("collection.track-count", childTracks.length) }}
    </p>
    <TrackList :tracks="childTracks" :origin="origin" album-is-known>
    </TrackList>
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
