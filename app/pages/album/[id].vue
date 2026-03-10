<script lang="ts" setup>
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.album"));

const { id } = useRoute<"album-id">().params;
const albumId = Number(id);
const { pending, data: album } = useAlbum({ id: albumId });

useHead({
  title: computed(() => album.value?.title || t("nav.album")),
});
</script>

<template>
  <div>
    <AlbumDetails v-if="album" :album="album"> </AlbumDetails>
    <ul v-if="pending">
      <li
        v-for="index in 5"
        :key="index"
        class="my-6 h-11 w-full animate-pulse rounded-lg bg-background-2"
      ></li>
    </ul>
  </div>
</template>
