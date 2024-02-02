<script lang="ts" setup>
import type { DiscoverGetRequest } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();
const userData = useNuxtApp().$userData;
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.home"));

const parameters: DiscoverGetRequest = {};
if (userData.age) parameters.age = userData.age;
const { data: models, pending } = useDiscover(parameters);
</script>

<template>
  <DocumentList :items="models" :pending="pending"></DocumentList>
</template>
