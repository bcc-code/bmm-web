<script lang="ts" setup>
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.browse"));

const { data: playlists } = useCuratedPlaylists();
</script>

<template>
  <div>
    <PageHeading class="mb-6">{{ $t("nav.browse") }}</PageHeading>
    <PlaylistOverview v-if="playlists" :playlists="playlists" />
  </div>
</template>
