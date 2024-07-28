<script lang="ts" setup>
import { ContributorApi } from "@bcc-code/bmm-sdk-fetch";
import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";

const { setQueue } = useNuxtApp().$mediaPlayer;
const { t } = useI18n();
const { id } = useRoute<"playlist-contributor-id">().params;
const contributorId = Number(id);
const { data: contributor } = useContributor({ id: contributorId });
let tracks: TrackModel[] = [];
const api = new ContributorApi();

toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.contributor"));
const origin = computed(() => `Contributor|${contributorId}`);
useHead({
  title: computed(() => contributor.value?.name || t("nav.contributor")),
});

const onPressPlay = () => {
  if (tracks.length > 0) {
    setQueue(tracks, 0, origin.value);
  }
};
const onPressShuffle = async () => {
  try {
    const shuffledTracks = (await useContributorShuffle(contributorId)).data
      .value;

    if (shuffledTracks) {
      setQueue(shuffledTracks, 0, origin.value);
    }
  } catch (e) {
    // TODO: Show an error message to the user
    console.error("error", e);
  }
};

async function load(skip: number, take: number) {
  const data = await api.contributorIdTrackGet({
    id: contributorId,
    from: skip,
    size: take,
  });
  if (skip === 0) tracks = data;
  else tracks = tracks.concat(data);
  return data || [];
}
</script>

<template>
  <div>
    <TrackCollectionHeader>
      <template #cover>
        <CoverImage :src="contributor?.cover" class="rounded-full" />
      </template>
      <template #heading>
        <PageHeading>{{ contributor?.name }}</PageHeading>
      </template>
      <template #actions>
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
          <ButtonStyled icon="icon.link"></ButtonStyled>
        </CopyToClipboard>
      </template>
    </TrackCollectionHeader>

    <EndlessDocumentList :load="load" :origin="origin" />
  </div>
</template>
