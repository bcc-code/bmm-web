<script lang="ts" setup>
const { t } = useI18n();
const { data: list, pending } = useContributors();
setTitle(() => t("nav.contributors"));
</script>

<template>
  <DocumentList :items="list" :pending="pending"></DocumentList>
</template>
