<script lang="ts" setup>
const { t } = useI18n();
const { id } = useRoute<"playlist-contributor-id">().params;
const contributorId = Number(id);
const { data: contributor } = useContributor({ id: contributorId });
const { data: tracks, pending: tracksPending } = useContributorTracks({
  id: contributorId,
});

toolbarTitleStore().setReactiveToolbarTitle(
  () => contributor.value?.name || "",
);

useHead({
  title: contributor.value?.name || "",
});
</script>

<template>
  <div>
    <header class="mb-12 flex gap-6">
      <ProtectedImage
        v-if="contributor?.cover"
        :src="contributor?.cover"
        alt=""
        class="bg-slate-100 aspect-square w-[240px] rounded-2xl mt-10"
      />
      <div class="flex flex-col justify-between px-6 pt-4">
        <div>
          <PageHeading>{{ contributor?.name }}</PageHeading>
          <p v-if="tracks">
            {{ t("collection.track-count", tracks.length) }}
          </p>
        </div>
      </div>
    </header>
    <TrackList
      :skeleton-count="5"
      :show-skeleton="tracksPending"
      :tracks="tracks"
    >
    </TrackList>
  </div>
</template>
