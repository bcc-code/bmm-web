<script lang="ts" setup>
toolbarTitleStore().setReactiveToolbarTitle(() => "Speeches");

const { data: speeches, pending } = useTracks({
  contentType2: ["speech"],
});
</script>

<template>
  <div>
    <PageHeading class="mb-6">Speeches</PageHeading>
    <TrackList :skeleton-count="10" :show-skeleton="pending">
      <TrackItem
        v-for="speech in speeches"
        :key="speech.id || 0"
        :track="speech"
        show-thumbnail
      />
    </TrackList>
  </div>
</template>
