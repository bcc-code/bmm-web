<script lang="ts" setup>
import type { DiscoverGetRequest } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.home"));

const parameters: DiscoverGetRequest = {};
const { data: models, pending } = useDiscover(parameters);
</script>

<template>
  <DocumentList
    :items="models"
    :pending="pending"
    class="mt-6 lg:mt-12"
  ></DocumentList>
</template>
