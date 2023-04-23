<script lang="ts" setup>
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.album"));

const { id } = useRoute().params;
const albumId = Number(id);

const { data: album } = useAlbum({ id: albumId });
// const { data: albums } = useAlbums();

// onBeforeMount(() => {
//   useHead({
//     title: album.value?.title || "",
//   });

//   console.log("albums", albums);
//   console.log("album", album);
// });
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
    <p v-if="album.children">{{ album.children.length }} albums</p>
    <div v-for="(child, index) in album?.children" :key="index">
      <AlbumSubAlbum :id="child.id"></AlbumSubAlbum>
    </div>
  </div>
</template>
