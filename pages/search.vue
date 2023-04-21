<script setup lang="ts">
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.search"));
</script>

<template>
  <h2>{{ $t("nav.search") }}</h2>
</template>
