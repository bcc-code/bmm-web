<script lang="ts" setup>
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.playlist"));

const { id } = useRoute<"playlist-private-id">().params;
const collectionId = Number(id);
const { data: collection, pending } = useTrackCollection({ id: collectionId });

useHead({
  title: collection.value?.name || "",
});
</script>

<template>
  <div>
    <header class="flex gap-6 mb-8">
      <template v-if="collection">
        <div>
          <PageHeading>{{ collection?.name }}</PageHeading>
          <p>{{ collection?.tracks?.length }} tracks</p>
        </div>
      </template>
      <div v-else class="h-12 bg-slate-100 w-1/3 rounded-lg mb-6"></div>
    </header>
    <TrackList
      :skeleton-count="5"
      :show-skeleton="pending"
      :tracks="collection?.tracks || null"
    >
    </TrackList>
  </div>
</template>
