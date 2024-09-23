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
    childTracks.value.findIndex(
      (track) => track.id === album.value?.latestTrackId,
    );
    setQueue(
      childTracks.value,
      0,
      origin.value,
      album.value.latestTrackPosition,
    );
  }
};
</script>

<template>
  <section
    class="relative my-4 mr-3 block cursor-pointer gap-2 duration-150"
    :class="active ? 'large-shadow rounded-3xl p-6' : 'group'"
    @click.stop="expand"
  >
    <div
      v-if="!active"
      class="absolute -inset-4 rounded-2xl bg-background-2 opacity-0 group-hover:opacity-100"
    ></div>
    <section v-if="album" class="relative flex items-center gap-4">
      <CoverImage :src="album.cover" class="w-[68px] rounded-md" />
      <div class="text-2xl font-extrabold">{{ album.title }}</div>
      <div
        v-if="album?.children && !active"
        class="ml-auto flex gap-1.5 rounded-3xl border-[1px] border-background-2 bg-background-2 px-4 py-2 group-hover:border-label-separator"
      >
        <span class="text-lg font-semibold leading-6">{{
          t("collection.track-count", album?.children.length)
        }}</span>
        <NuxtIcon name="icon.chevron.down" class="text-2xl" />
      </div>

      <div v-if="active && album.children" class="ml-auto flex gap-2">
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
          @click.stop="setQueue(childTracks, 0, origin)"
          >{{ t("podcast.action.play") }}</ButtonStyled
        >
        <ButtonStyled
          v-if="album.latestTrackId"
          icon="icon.play"
          intent="primary"
          @click.stop="onResume()"
          >{{ t("collection.resume") }}</ButtonStyled
        >
      </div>
    </section>
    <section
      v-if="album?.children?.length && album?.children?.length > 0"
      :class="active ? 'active relative max-h-fit' : 'h-0 overflow-hidden'"
    >
      <div
        class="mt-2 border-b-[1px] border-b-label-separator py-3 text-label-3"
      >
        {{ t("collection.track-count", album?.children?.length) }}
      </div>
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
