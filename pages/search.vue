<script lang="ts" setup>
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.search"));
</script>

<template>
  <PageHeading class="mb-6">Search</PageHeading>
</template>
