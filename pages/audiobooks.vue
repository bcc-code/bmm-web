<script lang="ts" setup>
toolbarTitleStore().setReactiveToolbarTitle(() => "Audiobooks");

const { data: audiobooks, pending } = useTracks({
  contentType2: ["audiobook"],
});
</script>

<template>
  <div>
    <PageHeading class="mb-6">Audiobooks</PageHeading>
    <TrackList
      :skeleton-count="10"
      :show-skeleton="pending"
      :tracks="audiobooks"
    >
    </TrackList>
  </div>
</template>
