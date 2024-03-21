<script lang="ts" setup>
import { BrowseApi } from "@bcc-code/bmm-sdk-fetch";

const api = new BrowseApi();

async function load(skip: number, take: number) {
  const data = await api.browseAudiobooksGet({ skip, take });
  toolbarTitleStore().setToolbarTitle(data.title || "");
  return data.items || [];
}
</script>

<template>
  <EndlessDocumentList :load="load" />
</template>
