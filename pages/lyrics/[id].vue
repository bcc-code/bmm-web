<script setup lang="ts">
import { ContributorApi, LyricsApi } from "@bcc-code/bmm-sdk-fetch";
import type { ContributorModel, Lyrics } from "@bcc-code/bmm-sdk-fetch";

const route = useRoute("lyrics-id");

const lyrics = ref<Lyrics>();

onMounted(async () => {
  lyrics.value = await new LyricsApi().lyricsIdGet({
    id: Number(route.params.id),
  });
});

const verses = computed({
  get() {
    return lyrics.value?.verses
      ?.map(
        (v) =>
          `<h3>${v.title}</h3><p>${v.text?.split("\n").join("</p><p>")}</p>`,
      )
      .join("");
  },
  set(value) {
    if (!lyrics.value || !value) return;
    const verseStrings = value
      .replaceAll("<h3>", "\n<h3>")
      .split("\n")
      .filter(Boolean);
    const verseObjects = verseStrings.map((verseString) => {
      const title = verseString.match(/<h3>(.*?)<\/h3>/)?.[1];
      const text = verseString
        .replace(/<h3>(.*?)<\/h3>/, "")
        .split("</p><p>")
        .join("\n")
        .replaceAll("<p>", "")
        .replaceAll("</p>", "");
      return { title, text };
    });

    lyrics.value.verses = verseObjects;
  },
});

const saving = ref(false);
async function saveLyrics() {
  if (!lyrics.value) return;
  saving.value = true;
  try {
    await new LyricsApi().lyricsIdPut({
      id: Number(route.params.id),
      lyrics: lyrics.value,
    });
  } catch {
  } finally {
    saving.value = false;
  }
}

const contributors = ref<ContributorModel[]>([]);
const contributorSearch = ref("");
const composer = ref<ContributorModel>();
const lyricist = ref<ContributorModel>();

watch([composer, lyricist], ([c, l]) => {
  if (!lyrics.value) return;
  if (c) {
    lyrics.value.composers = [c.id];
  }
  if (l) {
    lyrics.value.lyricists = [l.id];
  }
});

watchDebounced(
  contributorSearch,
  async (search) => {
    if (search === "" || !search) return;

    contributors.value =
      await new ContributorApi().contributorSuggesterCompletionTermGet({
        term: search,
      });
  },
  { debounce: 100 },
);
</script>

<template>
  <div v-if="lyrics">
    <div class="flex items-center justify-between gap-6">
      <PageHeading>{{ lyrics.songTitle }}</PageHeading>
      <ButtonStyled :loading="saving" intent="primary" @click="saveLyrics">
        {{ $t("lyrics.save") }}
      </ButtonStyled>
    </div>
    <div class="grid gap-8 lg:grid-cols-2 lg:grid-rows-1">
      <div class="row-start-1 flex flex-col gap-4 md:col-start-2">
        <ComboSearchBox
          v-model:search="contributorSearch"
          v-model="composer"
          label="Composer"
          :options="contributors"
          :option-key="(c) => c.id"
          :display-value="(option) => option.name!"
        >
          <template #option="{ option }">
            {{ option.name }}
          </template>
        </ComboSearchBox>
        <ComboSearchBox
          v-model:search="contributorSearch"
          v-model="lyricist"
          label="Lyricist"
          :options="contributors"
          :option-key="(c) => c.id"
          :display-value="(option) => option.name!"
        >
          <template #option="{ option }">
            {{ option.name }}
          </template>
        </ComboSearchBox>
      </div>

      <LyricsEditor v-model="verses" class="md:col-start-1 md:row-start-1" />
    </div>
  </div>
</template>
