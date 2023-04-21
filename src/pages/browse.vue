<script setup lang="ts">
import { useI18n } from "vue-i18n";
import toolbarTitleStore from "@/stores/toolbarTitle";

const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.browse"));
</script>

<template>
  <h2>{{ $t("nav.browse") }}</h2>
</template>
