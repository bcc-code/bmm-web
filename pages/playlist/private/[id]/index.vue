<script lang="ts" setup>
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.playlist"));

const { id } = useRoute<"playlist-private-id">().params;
const collectionId = Number(id);
const { data: collection, pending } = usePrivatePlaylist({ id: collectionId });

useHead({
  title: collection.value?.name || "",
});
</script>

<template>
  <div>
    <header class="mb-12 flex gap-6">
      <template v-if="collection">
        <div>
          <PageHeading>{{ collection?.name }}</PageHeading>
          <p v-if="collection?.tracks">
            {{ t("collection.track-count", collection.tracks.length) }}
          </p>
        </div>
      </template>
      <div v-else class="mb-6 h-12 w-1/3 rounded-lg bg-background-2"></div>
    </header>
    <TrackList
      :skeleton-count="5"
      :show-skeleton="pending"
      :tracks="collection?.tracks || null"
    >
    </TrackList>
  </div>
</template>
