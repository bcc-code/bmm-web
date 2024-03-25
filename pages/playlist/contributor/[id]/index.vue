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

useHead({
  title: contributor.value?.name || "",
});
const onPressPlay = () => {
  if (tracks.length > 0) {
    setQueue(tracks);
  }
};
const onPressShuffle = async () => {
  const shuffledTracks = (await useContributorShuffle(contributorId)).data
    .value;

  if (shuffledTracks) {
    setQueue(shuffledTracks);
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
    <header class="mb-12 flex gap-6">
      <div class="mt-10">
        <CoverImage :src="contributor?.cover" class="w-[240px] rounded-full" />
      </div>
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

    <EndlessDocumentList :load="load" />
  </div>
</template>
