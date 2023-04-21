<script setup lang="ts">
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.home"));
</script>

<template>
  <div>
    <h2>{{ $t("nav.home") }}</h2>
    <PlaylistOverview />
  </div>
</template>
