<script lang="ts" setup>
const { setQueue } = useNuxtApp().$mediaPlayer;
const { t } = useI18n();
const { id } = useRoute<"playlist-contributor-id">().params;
const contributorId = Number(id);
const { data: contributor } = useContributor({ id: contributorId });
const { data: tracks, pending: tracksPending } = useContributorTracks({
  id: contributorId,
});

toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.contributor"));

useHead({
  title: contributor.value?.name || "",
});
const onPressPlay = () => {
  if (tracks.value) {
    setQueue(tracks.value);
  }
};
const onPressShuffle = async () => {
  const shuffledTracks = (await useContributorShuffle(contributorId)).data
    .value;

  if (shuffledTracks) {
    setQueue(shuffledTracks);
  }
};
</script>

<template>
  <div>
    <header class="mb-12 flex gap-6">
      <ProtectedImage
        v-if="contributor?.cover"
        :src="contributor?.cover"
        class="bg-slate-100 aspect-square w-[240px] rounded-full mt-10"
      />
      <div class="flex flex-col justify-between px-6 pt-4">
        <div>
          <PageHeading>{{ contributor?.name }}</PageHeading>
        </div>
        <div class="flex gap-2">
          <ButtonStyled
            intent="primary"
            icon="icon.play"
            @click.stop="onPressPlay"
          >
            {{ t("podcast.action.play") }}
          </ButtonStyled>
          <ButtonStyled
            intent="primary"
            icon="icon.shuffle"
            @click.stop="onPressShuffle"
          >
            {{ t("playlist.action.shuffle") }}
          </ButtonStyled>
          <CopyToClipboard
            :link="{
              name: 'playlist-contributor-id',
              params: { id: contributorId },
            }"
          >
            <ButtonStyled icon="icon.link" icon-only></ButtonStyled>
          </CopyToClipboard>
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
