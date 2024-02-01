<script lang="ts" setup>
import type { DocumentListIAllDocumentModels } from "@bcc-code/bmm-sdk-fetch";

const { data: models, pending } = useFeaturedPlaylists();
</script>

<template>
  <DocumentList
    :list="models as DocumentListIAllDocumentModels"
    :pending="pending"
  ></DocumentList>
</template>
