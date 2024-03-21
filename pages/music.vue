<script lang="ts" setup>
import { TrackApi } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();
const api = new TrackApi();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.recent-music"));

async function load(skip: number, take: number) {
  const data = await api.trackGet({
    from: skip,
    size: take,
    contentType2: ["song"],
  });
  return data || [];
}
</script>

<template>
  <div>
    <PageHeading>{{ $t("nav.recent-music") }}</PageHeading>

    <EndlessDocumentList :load="load" />
  </div>
</template>
