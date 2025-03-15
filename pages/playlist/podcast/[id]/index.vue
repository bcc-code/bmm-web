<script lang="ts" setup>
import { PodcastApi } from "@bcc-code/bmm-sdk-fetch";
import type { TrackModel, IAllDocumentModels } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.podcast"));

const api = new PodcastApi();
const { setQueue } = useNuxtApp().$mediaPlayer;
const { id } = useRoute<"playlist-podcast-id">().params;
const collectionId = Number(id);
const isDailyPodcast = [1, 53, 54, 55, 56, 57].includes(collectionId);
let tracks: TrackModel[] = [];

const { data: podcast } = usePodcast({ id: collectionId });

const onPressPlay = () => {
  if (tracks.length > 0) {
    setQueue(tracks);
  }
};

const onPressShuffle = async () => {
  try {
    const shuffledTracks = (await usePodcastShuffle(collectionId)).data.value;

    if (shuffledTracks) {
      setQueue(shuffledTracks);
    }
  } catch (e) {
    // TODO: Show an error message to the user
    console.error("error", e);
  }
};

type Week = {
  week: number;
  year: number;
};

function weekOfYear(date: Date) {
  const janFirst = new Date(date.getFullYear(), 0, 1);
  const yearWeek = Math.ceil(
    ((date.getTime() - janFirst.getTime()) / 86400000 + janFirst.getDay() + 1) /
      7,
  );
  const week: Week = { week: yearWeek, year: date.getFullYear() };
  return week;
}

let lastWeek: Week = { week: 0, year: 0 };

function groupByWeek(data: TrackModel[]) {
  const models: IAllDocumentModels[] = [];

  data.forEach((track) => {
    const week = track.publishedAt
      ? weekOfYear(track.publishedAt)
      : { week: 0, year: 0 };

    const now = weekOfYear(new Date());
    const isThisWeek = now.week === week.week && now.year === week.year;
    const isPreviousWeek = now.week === week.week + 1 && now.year === week.year;
    if (lastWeek.year !== week.year || lastWeek.week !== week.week)
      models.push({
        type: "section_header",
        id: week.year * 100 + week.week,
        // eslint-disable-next-line no-nested-ternary
        title: isThisWeek
          ? t("podcast.this-week")
          : isPreviousWeek
            ? t("podcast.last-week")
            : t("podcast.week-x", week.week),
      });
    models.push(track);
    lastWeek = week;
  });

  return models;
}

async function load(skip: number, take: number) {
  const data = await api.podcastIdTrackGet({
    id: collectionId,
    from: skip,
    size: take,
  });
  const models: IAllDocumentModels[] = [];
  if (data?.length > 0) {
    if (isDailyPodcast) models.push(...groupByWeek(data));
    else models.push(...data);
  }

  if (skip === 0) tracks = data;
  else tracks = tracks.concat(data);
  return models;
}

useHead({
  title: computed(() => podcast.value?.title || t("nav.podcast")),
});
</script>

<template>
  <div>
    <template v-if="podcast">
      <TrackCollectionHeader>
        <template #cover>
          <CoverImage :src="podcast.cover" class="rounded-2xl" />
        </template>
        <template #heading>
          <PageHeading>{{ podcast.title }}</PageHeading>
        </template>
        <template #actions>
          <ButtonStyled intent="primary" icon="icon.play" @click="onPressPlay">
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
        </template>
      </TrackCollectionHeader>

      <EndlessDocumentList
        :load="load"
        :use-daily-podcast-view="isDailyPodcast"
      />
    </template>
  </div>
</template>
