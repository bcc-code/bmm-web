<script lang="ts" setup>
import type { IAllDocumentModels } from "@bcc-code/bmm-sdk-fetch";

const { data: models, pending } = useBrowseEvents();

toolbarTitleStore().setReactiveToolbarTitle(() => models.value?.title ?? " ");
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
      <DocumentModels
        v-if="
          models !== null && models.items !== null && models.items !== undefined
        "
        :models="models.items as IAllDocumentModels[]"
      ></DocumentModels>
    </template>
  </div>
</template>
