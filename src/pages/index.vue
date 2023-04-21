<script setup lang="ts">
import PlaylistOverview from "@/components/playlist/PlaylistOverview.vue";
import { useI18n } from "vue-i18n";
import toolbarTitleStore from "@/stores/toolbarTitle";

const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.home"));
</script>

<template>
  <div>
    <h2>{{ $t("nav.home") }}</h2>
    <PlaylistOverview />
  </div>
</template>
