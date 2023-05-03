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
    <header class="flex gap-6 mb-12">
      <ProtectedImage
        v-if="album.cover"
        :src="album.cover"
        alt=""
        class="aspect-square rounded-2xl bg-slate-100 w-[300px]"
      />
      <div class="p-6 flex flex-col justify-between">
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
        :id="child.id || 0"
        :active="expandedAlbum === `${child.id}-${i}`"
        @expand="toggleExpandedAlbum(`${child.id}-${i}`)"
      ></AlbumSubAlbum>
    </div>
  </div>
</template>
