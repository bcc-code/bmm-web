<script lang="ts" setup>
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.album"));

const { id } = useRoute<"album-id">().params;
const albumId = Number(id);
</script>

<template>
  <AlbumDetails :album-id="albumId"> </AlbumDetails>
</template>
