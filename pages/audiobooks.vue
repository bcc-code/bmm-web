<script lang="ts" setup>
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.audiobooks"));

const { data: audiobooks, pending } = useTracks({
  contentType2: ["audiobook"],
});
</script>

<template>
  <div>
    <PageHeading class="mb-6">{{ $t("nav.audiobooks") }}</PageHeading>
    <TrackList
      :skeleton-count="10"
      :show-skeleton="pending"
      :tracks="audiobooks"
    >
    </TrackList>
  </div>
</template>
