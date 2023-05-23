<script lang="ts" setup>
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.album"));

const { id } = useRoute<"album-id">().params;
const albumId = Number(id);

const { data: album } = useAlbum({ id: albumId });

const expandedAlbum: Ref<null | string> = ref(null);

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
          <PageHeading>{{ album.title }}</PageHeading>
        </div>
        <div class="flex gap-2">
          <ButtonStyled>F</ButtonStyled>
        </div>
      </div>
    </header>
    <p v-if="album.children" class="p-2">{{ album.children.length }} albums</p>
    <div v-for="(child, i) in album?.children" :key="`${child.id}-${i}`">
      <AlbumSubAlbum
        :id="child.id"
        :active="expandedAlbum === `${child.id}-${i}`"
        @expand="toggleExpandedAlbum(`${child.id}-${i}`)"
      ></AlbumSubAlbum>
    </div>
  </div>
</template>
