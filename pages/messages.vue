<script lang="ts" setup>
definePageMeta({
  toolbarTitle: "Speeches",
});

const { data: speeches, pending } = useTracks({
  contentType2: ["speech"],
});
</script>

<template>
  <div>
    <Heading class="mb-6">Speeches</Heading>
    <TrackList :skeleton-count="10" :show-skeleton="pending">
      <Track
        v-for="speech in speeches"
        :key="speech.id"
        :track="speech"
        show-thumbnail
      />
    </TrackList>
  </div>
</template>
