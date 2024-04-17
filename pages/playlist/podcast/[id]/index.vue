<script lang="ts" setup>
import { PodcastApi } from "@bcc-code/bmm-sdk-fetch";
import type { TrackModel, IAllDocumentModels } from "@bcc-code/bmm-sdk-fetch";

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
  console.log(date, date.getUTCDate());

  const onejan = new Date(date.getFullYear(), 0, 1);
  const yearWeek = Math.ceil(
    ((date.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7,
  );
  console.log(yearWeek);
  const week: Week = { week: yearWeek, year: date.getFullYear() };
  return week;
}

function parseWeek(input: string) {
  const [year, week] = input.split("_");
  return { year: Number(year), week: Number(week) };
}

let lastWeek: Week = { week: 0, year: 0 };

function groupByWeek(data: TrackModel[]) {
  const models: IAllDocumentModels[] = [];
  const weeks = Map.groupBy(data, (track) => {
    const week = track.publishedAt
      ? weekOfYear(track.publishedAt)
      : { week: 0, year: 0 };
    return `${week.year}_${week.week}`;
  });
  weeks.forEach((weekTracks, weekString) => {
    const week = parseWeek(weekString);
    const now = weekOfYear(new Date());
    const isThisWeek = now.week === week.week && now.year === week.year;
    const isPreviousWeek = now.week === week.week + 1 && now.year === week.year;
    if (lastWeek.year !== week.year || lastWeek.week !== week.week)
      models.push({
        type: "section_header",
        id: week.year * 100 + week.week,
        // eslint-disable-next-line no-nested-ternary
        title: isThisWeek
          ? "This week"
          : isPreviousWeek
            ? "Last week"
            : `Week ${week.week}`,
      });
    models.push(...weekTracks);
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
    if (collectionId === 1 || collectionId === 55)
      models.push(...groupByWeek(data));
    else models.push(...data);
  }

  if (skip === 0) tracks = data;
  else tracks = tracks.concat(data);
  return models;
}
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
