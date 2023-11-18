<script lang="ts" setup>
import { AlbumModel, TrackModel } from "@bcc-code/bmm-sdk-fetch";

const props = defineProps<{
  id: number;
  active: boolean;
}>();

const { t } = useI18n();
const { data: album } = useAlbum({ id: props.id });

const emit = defineEmits<{ expand: [] }>();

function expand() {
  emit("expand");
}
</script>

<template>
  <section
    class="relative my-4 mr-3 cursor-pointer gap-2 duration-150"
    :class="active ? 'rounded-3xl border-2 p-5 shadow-lg' : ''"
    @click.stop="expand"
  >
    <div
      :class="
        active
          ? ''
          : 'bg-slate-100 absolute -inset-x-3 -inset-y-2 rounded-xl opacity-0'
      "
    ></div>
    <section
      v-if="album"
      class="relative flex items-center justify-between gap-2"
    >
      <ProtectedImage
        v-if="album.cover"
        :src="album.cover"
        alt=""
        class="bg-slate-100 aspect-square w-20 rounded-md"
      />
      <p class="text-2xl font-bold">{{ album.title }}</p>
      <p v-if="album?.children" class="ml-auto">
        {{ t("collection.track-count", album?.children.length) }}
      </p>
    </section>
    <section
      :class="active ? 'active relative max-h-fit' : 'h-0 overflow-hidden'"
    >
      <TrackList
        :tracks="
          album?.children?.filter((c): c is TrackModel => c.type === 'track') ||
          []
        "
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
