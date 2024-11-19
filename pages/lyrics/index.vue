<script setup lang="ts">
import { LyricsApi } from "@bcc-code/bmm-sdk-fetch";
import type { Lyrics } from "@bcc-code/bmm-sdk-fetch";

const { t } = useI18n();
setTitle(() => t("nav.lyrics"));

const showCreateDialog = ref(false);
const createForm = reactive({
  title: "",
});

const resetForm = () => {
  createForm.title = "";
};

const items = ref<Lyrics[]>([]);
onMounted(async () => {
  items.value = await new LyricsApi().lyricsGet();
});

const loading = ref(false);
async function createLyrics() {
  loading.value = true;

  await new LyricsApi().lyricsPost({
    lyrics: {
      songTitle: createForm.title,
      source: "Manual",
    },
  });

  items.value = await new LyricsApi().lyricsGet();

  resetForm();

  loading.value = false;
  showCreateDialog.value = false;
}
</script>

<template>
  <div>
    <header class="flex items-center justify-between gap-4">
      <PageHeading>{{ t("nav.lyrics") }}</PageHeading>
      <ButtonStyled
        intent="primary"
        icon="icon.add"
        @click="showCreateDialog = true"
      >
        {{ $t("lyrics.create-new-lyrics") }}
      </ButtonStyled>
    </header>
    <div class="grid grid-cols-[1fr_auto] divide-y divide-label-separator">
      <NuxtLink
        v-for="item in items"
        :key="item.id"
        class="col-span-full grid grid-cols-subgrid items-center justify-between gap-4 py-4"
        :to="{ name: 'lyrics-id', params: { id: item.id } }"
      >
        <p class="type-title-2">{{ item.songTitle }}</p>
        <ButtonStyled intent="secondary">
          {{ $t("lyrics.edit") }}
        </ButtonStyled>
      </NuxtLink>
    </div>

    <DialogBase
      :show="showCreateDialog"
      :title="$t('lyrics.create-new-lyrics')"
      hide-button
      @close="showCreateDialog = false"
    >
      <form
        class="flex flex-col gap-2 sm:min-w-96"
        @submit.prevent="createLyrics"
      >
        <div class="flex flex-col gap-1">
          <label for="lyrics-title" class="type-subtitle-2 text-label-3">
            Song title
          </label>
          <input
            id="lyrics-title"
            v-model="createForm.title"
            class="rounded-lg border border-label-separator bg-background-2 px-4 py-2"
            required
          />
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <ButtonStyled
            intent="tertiary"
            type="button"
            @click="showCreateDialog = false"
          >
            {{ $t("global.cancel") }}
          </ButtonStyled>
          <ButtonStyled intent="primary" type="submit" :loading="loading">
            {{ $t("lyrics.create") }}
          </ButtonStyled>
        </div>
      </form>
    </DialogBase>
  </div>
</template>
