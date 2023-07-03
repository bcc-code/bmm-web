<script lang="ts" setup>
const { id } = useRoute<"playlist-contributor-id">().params;
const contributorId = Number(id);
const { data: contributor } = useContributor({ id: contributorId });
const { data: tracks, pending: tracksPending } = useContributorTracks({
  id: contributorId,
});

toolbarTitleStore().setReactiveToolbarTitle(
  () => contributor.value?.name || ""
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
        class="bg-slate-100 aspect-square w-[300px] rounded-2xl"
      />
      <div class="flex flex-col justify-between p-6">
        <div>
          <PageHeading>{{ contributor?.name }}</PageHeading>
          <p>{{ tracks?.length }} tracks</p>
        </div>
        <div class="flex gap-2">
          <ButtonStyled>F</ButtonStyled>
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
