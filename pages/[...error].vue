<script setup lang="ts">
const { t } = useI18n();
const { params } = useRoute<"error">();
setTitle(() => t("nav.unknown"));
</script>

<template>
  <div>
    <h2>{{ $t("error.page-not-found.headline") }}</h2>
    {{ $t("error.page-not-found.text", { path: params.error.join("/") }) }}
  </div>
</template>
