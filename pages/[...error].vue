<script setup lang="ts">
const { t } = useI18n();
const { params } = useRoute<"error">();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.unknown"));
useHead({
  title: computed(() => t("nav.unknown")),
});
</script>

<template>
  <div>
    <h2>{{ $t("error.page-not-found.headline") }}</h2>
    {{ $t("error.page-not-found.text", { path: params.error.join("/") }) }}
  </div>
</template>
