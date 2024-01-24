<script lang="ts" setup>
import type { DiscoverGetRequest, LanguageEnum } from "@bcc-code/bmm-sdk-fetch";

const { t, locale } = useI18n();
const userData = useNuxtApp().$userData;
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.home"));

const parameters: DiscoverGetRequest = {
  // Compatibility is ensured in i18n.config.ts file
  lang: locale.value as LanguageEnum,
};
if (userData.age) parameters.age = userData.age;
const { data: models, pending } = useDiscover(parameters);
</script>

<template>
  <div>
    <template v-if="pending">
      <ul>
        <li
          v-for="index in 5"
          :key="index"
          class="my-6 h-11 w-full animate-pulse rounded-lg bg-background-2"
        ></li>
      </ul>
    </template>
    <template v-else>
      <DocumentModels v-if="models !== null" :models="models"></DocumentModels>
    </template>
  </div>
</template>
