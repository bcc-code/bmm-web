<script lang="ts" setup>
const { t } = useI18n();
toolbarTitleStore().setReactiveToolbarTitle(() => t("nav.playlist"));

const { id } = useRoute<"playlist-curated-id">().params;
const playlistId = Number(id);

const { data: playlist } = usePlaylist({ id: playlistId });
const { data: tracks, pending } = usePlaylistTracks({ id: playlistId });

onBeforeMount(() => {
  useHead({
    title: playlist.value?.title || "",
  });
});
</script>

<template>
  <div class="grid grid-cols-12" v-if="playlist">
    <div class="col-start-3 col-span-8">
      <header class="flex gap-6 mb-12">
        <ProtectedImage
          v-if="playlist.cover"
          :src="playlist.cover"
          alt=""
          class="aspect-square rounded-2xl bg-slate-100 w-[300px]"
        />
        <div class="p-6 flex flex-col justify-between">
          <div>
            <PageHeading>{{ playlist.title }}</PageHeading>
            <p v-if="tracks">{{ tracks.length }} tracks</p>
          </div>
          <div class="flex gap-2">
            <ButtonStyled intent="primary"> Shuffle </ButtonStyled>
            <ButtonStyled>Follow</ButtonStyled>
          </div>
        </div>
      </header>
      <TrackList
        :skeleton-count="10"
        :show-skeleton="pending"
        :tracks="tracks"
      />
    </div>
  </div>
</template>
