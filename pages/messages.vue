<script lang="ts" setup>
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.messages"));

const { data: speeches, pending } = useTracks({
  contentType2: ["speech"],
});
</script>

<template>
  <div>
    <PageHeading class="mb-6">{{ $t("nav.messages") }}</PageHeading>
    <TrackList :skeleton-count="10" :show-skeleton="pending" :tracks="speeches">
    </TrackList>
  </div>
</template>
