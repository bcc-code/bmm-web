<script lang="ts" setup>
import { PodcastApi } from "@bcc-code/bmm-sdk-fetch";
import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.podcast"));

const api = new PodcastApi();
const { setQueue } = useNuxtApp().$mediaPlayer;
const { id } = useRoute<"playlist-podcast-id">().params;
const collectionId = Number(id);
let tracks: TrackModel[] = [];

const { data: podcast } = usePodcast({ id: collectionId });

const onPressPlay = () => {
  if (tracks.length > 0) {
    setQueue(tracks);
  }
};

const onPressShuffle = async () => {
  const shuffledTracks = (await usePodcastShuffle(collectionId)).data.value;

  if (shuffledTracks) {
    setQueue(shuffledTracks);
  }
};

async function load(skip: number, take: number) {
  const data = await api.podcastIdTrackGet({
    id: collectionId,
    from: skip,
    size: take,
  });
  if (skip === 0) tracks = data;
  else tracks = tracks.concat(data);
  return data || [];
}

// TODO: Group episodes into weeks
</script>

<template>
  <div v-if="podcast">
    <div>
      <header class="mb-12 flex gap-6">
        <div class="mt-10">
          <CoverImage :src="podcast.cover" class="w-[240px] rounded-2xl" />
        </div>
        <div class="flex flex-col justify-between px-6 pt-4">
          <div>
            <PageHeading>{{ podcast.title }}</PageHeading>
          </div>
          <div class="flex gap-2">
            <ButtonStyled
              intent="primary"
              icon="icon.play"
              @click="onPressPlay"
            >
              {{ t("podcast.action.play") }}
            </ButtonStyled>
            <ButtonStyled
              intent="primary"
              icon="icon.shuffle"
              @click="onPressShuffle"
            >
              {{ t("playlist.action.shuffle") }}
            </ButtonStyled>
            <CopyToClipboard
              :link="{
                name: 'playlist-podcast-id',
                params: { id: collectionId },
              }"
            >
              <ButtonStyled icon="icon.link"></ButtonStyled>
            </CopyToClipboard>
          </div>
        </div>
      </header>

      <EndlessDocumentList :load="load" />
    </div>
  </div>
</template>
