<script lang="ts" setup>
definePageMeta({
  toolbarTitle: "Audiobooks",
});

const { data: audiobooks, pending } = useTracks({
  contentType2: ["audiobook"],
});
</script>

<template>
  <div>
    <Heading class="mb-6">Audiobooks</Heading>
    <TrackList :skeleton-count="10" :show-skeleton="pending">
      <Track
        v-for="audiobook in audiobooks"
        :key="audiobook.id"
        :track="audiobook"
        show-thumbnail
      />
    </TrackList>
  </div>
</template>
