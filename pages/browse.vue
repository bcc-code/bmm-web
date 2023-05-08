<script lang="ts" setup>
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.browse"));

const { data: playlists } = usePlaylists();
</script>

<template>
  <div>
    <PageHeading class="mb-6">{{ $t("nav.browse") }}</PageHeading>
    <PlaylistOverview v-if="playlists" :playlists="playlists" />
  </div>
</template>
