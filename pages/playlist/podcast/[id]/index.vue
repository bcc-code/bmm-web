<script lang="ts" setup>
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.podcast"));

const { id } = useRoute<"playlist-podcast-id">().params;
const collectionId = Number(id);

const { data: podcast } = usePodcast({ id: collectionId });
const { data: tracks, pending: tracksPending } = usePodcastTracks({
  id: collectionId,
});

const trackGroups = computed(() => {
  if (tracks.value) {
    const sorted = tracks.value.sort((a, b) =>
      a.publishedAt! > b.publishedAt! ? -1 : 1,
    );

    // split the tracks into groups of 7
    const groups = [];
    for (let i = 0; i < sorted.length; i += 7) {
      groups.push(sorted.slice(i, i + 7));
    }

    return groups;
  }

  return [];
});

useHead({
  title: podcast.value?.title || "",
});
</script>

<template>
  <div v-if="podcast" class="grid grid-cols-12">
    <div class="col-span-8 col-start-3">
      <header class="mb-12 flex gap-6">
        <ProtectedImage
          v-if="podcast.cover"
          :src="podcast.cover"
          alt=""
          class="aspect-square w-[300px] rounded-2xl bg-background-2"
        />
        <div class="flex flex-col justify-between p-6">
          <div>
            <PageHeading>{{ podcast.title }}</PageHeading>
            <p v-if="tracks">
              {{ t("collection.track-count", tracks.length) }}
            </p>
          </div>
          <div class="flex gap-2">
            <ButtonStyled intent="primary" style="border: 1px solid red">
              <NuxtIcon name="icon.play" />
              {{ t("podcast.action.play") }}
            </ButtonStyled>
            <ButtonStyled intent="secondary" style="border: 1px solid red">
              {{ t("podcast.action.follow") }}
            </ButtonStyled>
            <ButtonStyled intent="secondary" style="border: 1px solid red">
              <NuxtIcon name="icon.link" />
            </ButtonStyled>
          </div>
        </div>
      </header>
      <template v-for="(group, index) in trackGroups" :key="index">
        <h2 class="text-3xl font-bold mb-4 mt-12">This week</h2>
        <TrackList
          :skeleton-count="10"
          :show-skeleton="tracksPending"
          :tracks="group"
        />
      </template>
    </div>
  </div>
</template>
