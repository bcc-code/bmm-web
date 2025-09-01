<script lang="ts" setup>
import type { AlbumModel, TrackModel } from "@bcc-code/bmm-sdk-fetch";

const props = defineProps<{
  id: number;
  active: boolean;
}>();

const { setQueue } = useNuxtApp().$mediaPlayer;
const { t } = useI18n();
const { data: album } = useAlbum({ id: props.id });

const emit = defineEmits<{ expand: [] }>();

const origin = computed(() => `Album|${props.id}`);
function expand() {
  emit("expand");
}
const childTracks = computed(() => {
  if (album.value == null || !album.value.children) return [];

  return album.value.children.filter(
    (c): c is TrackModel => c.type === "track",
  );
});
const onResume = () => {
  if (childTracks.value && album.value && album.value !== null) {
    const index = childTracks.value.findIndex(
      (track) => track.id === album.value?.latestTrackId,
    );
    setQueue(
      childTracks.value,
      index,
      origin.value,
      album.value.latestTrackPosition
        ? album.value.latestTrackPosition / 1000
        : 0,
    );
  }
};
</script>

<template>
  <section
    class="relative my-4 mr-3 block cursor-pointer gap-2 duration-150"
    :class="active ? 'large-shadow -m-6 rounded-3xl p-6' : 'group'"
    @click.stop="expand"
  >
    <div
      v-if="!active"
      class="absolute -inset-4 rounded-2xl bg-background-2 opacity-0 group-hover:opacity-100"
    ></div>
    <section v-if="album" class="relative flex items-center gap-4">
      <CoverImage :src="album.cover" class="w-[68px] rounded-md" />
      <div>
        <div class="text-2xl font-extrabold">{{ album.title }}</div>
        <p class="type-paragraph-3 text-label-3">
          <TrackCountAndDuration
            :track-count="album.trackCount"
            :seconds="album.totalSeconds"
          ></TrackCountAndDuration>
        </p>
      </div>

      <div
        v-if="active && album.children"
        class="ml-auto flex gap-2"
        @click.stop
      >
        <AlbumMenu :album="album" />
        <CopyToClipboard
          :link="{
            name: 'album-id',
            params: { id: album.id },
          }"
        >
          <ButtonStyled icon="icon.link" class="bg-background-1"></ButtonStyled>
        </CopyToClipboard>
        <ButtonStyled
          icon="icon.play"
          intent="primary"
          @click="setQueue(childTracks, 0, origin)"
          >{{ t("podcast.action.play") }}</ButtonStyled
        >
        <ButtonStyled
          v-if="album.latestTrackId"
          icon="icon.play"
          intent="primary"
          @click="onResume()"
          >{{ t("collection.resume") }}</ButtonStyled
        >
      </div>
    </section>
    <section
      v-if="album?.children?.length && album?.children?.length > 0"
      :class="active ? 'active relative mt-4 max-h-fit' : 'h-0 overflow-hidden'"
    >
      <TrackList
        :track-type-is-known="false"
        :tracks="childTracks"
        :origin="origin"
      >
      </TrackList>
      <SubAlbum
        v-for="a in album?.children?.filter(
          (c): c is AlbumModel => c.type === 'album',
        )"
        :id="a.id"
        :key="a.id"
        :active="false"
      >
      </SubAlbum>
    </section>
  </section>
</template>
