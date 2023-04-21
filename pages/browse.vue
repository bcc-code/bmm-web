<script setup lang="ts">
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.browse"));
</script>

<template>
  <h2>{{ $t("nav.browse") }}</h2>
</template>
