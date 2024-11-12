<script setup lang="ts">
import { LyricsApi } from "@bcc-code/bmm-sdk-fetch";
import type { Lyrics } from "@bcc-code/bmm-sdk-fetch";

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
      <div class="row-start-1 md:col-start-2"></div>
      <LyricsEditor v-model="verses" class="md:col-start-1 md:row-start-1" />
    </div>
  </div>
</template>
