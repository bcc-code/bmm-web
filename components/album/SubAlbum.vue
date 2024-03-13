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

function expand() {
  emit("expand");
}
const childTracks = computed(() => {
  if (album.value == null || !album.value.children) return [];

  return album.value.children.filter(
    (c): c is TrackModel => c.type === "track",
  );
});
</script>

<template>
  <section
    class="block relative mr-3 cursor-pointer gap-2 duration-150 my-4"
    :class="active ? 'rounded-3xl p-6 album-shadow' : 'group'"
    @click.stop="expand"
  >
    <div
      v-if="!active"
      class="absolute -inset-4 opacity-0 group-hover:opacity-100 bg-background-2 rounded-2xl"
    ></div>
    <section v-if="album" class="relative flex items-center gap-4">
      <CoverImage :src="album.cover" class="w-[68px] rounded-md" />
      <div class="text-2xl font-extrabold">{{ album.title }}</div>
      <div
        v-if="album?.children && !active"
        class="flex gap-1.5 ml-auto px-4 py-2 bg-background-2 rounded-3xl group-hover:button-shadow border-[1px] border-background-2 group-hover:border-label-separator"
      >
        <span class="font-semibold text-lg leading-6">{{
          t("collection.track-count", album?.children.length)
        }}</span>
        <NuxtIcon name="icon.chevron.down" class="text-2xl" />
      </div>

      <div v-if="active && album.children" class="flex gap-2 ml-auto">
        <CopyToClipboard
          :link="{
            name: 'album-id',
            params: { id: album.id },
          }"
        >
          <ButtonStyled
            icon="icon.link"
            icon-only
            class="bg-background-1"
          ></ButtonStyled>
        </CopyToClipboard>

        <ButtonStyled
          icon="icon.play"
          intent="primary"
          @click.stop="setQueue(childTracks)"
          >{{ t("podcast.action.play") }}</ButtonStyled
        >
      </div>
    </section>
    <section
      v-if="album?.children?.length && album?.children?.length > 0"
      :class="active ? 'active relative max-h-fit' : 'h-0 overflow-hidden'"
    >
      <div
        class="py-3 mt-2 text-label-3 border-b-[1px] border-b-label-separator"
      >
        {{ t("collection.track-count", album?.children?.length) }}
      </div>
      <TrackList :track-type-is-known="false" :tracks="childTracks">
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
<style scoped>
.button-shadow {
  box-shadow:
    0px 4px 12px 0px #0000000d,
    0px 1px 4px 0px #0000000d,
    0px 0px 0px 1px #0000000d;
}

.album-shadow {
  box-shadow:
    0px 4px 80px 0px #0000001a,
    0px 4px 12px 0px #0000000d,
    0px 1px 4px 0px #0000000d,
    0px 0px 0px 1px #0000000d;
}
</style>
