<script lang="ts" setup>
const { t } = useI18n();
setTitle(() => t("nav.audiobooks"));

const { data: audiobooks, pending } = useTracks({
  contentType2: ["audiobook"],
});
</script>

<template>
  <div>
    <PageHeading>{{ $t("nav.audiobooks") }}</PageHeading>
    <TrackList
      show-thumbnails
      :skeleton-count="10"
      :show-skeleton="pending"
      :tracks="audiobooks"
    >
    </TrackList>
  </div>
</template>
