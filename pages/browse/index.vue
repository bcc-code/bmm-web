<script lang="ts" setup>
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.browse"));

const { data: models, pending } = useBrowse();
</script>

<template>
  <DocumentList :items="models" :pending="pending"></DocumentList>
</template>
