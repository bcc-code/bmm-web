<script setup lang="ts">
import { ContributorApi, LyricsApi } from "@bcc-code/bmm-sdk-fetch";
import type { ContributorModel, Lyrics } from "@bcc-code/bmm-sdk-fetch";

const DEFAULT_LONG_COPYRIGHT =
  "© Stiftelsen Skjulte Skatters Forlag, Norway. All rights reserved.";
const EDITOR_PLACEHOLDER =
  "<h3>Vers 1</h3><p>Herrens veier, Herrens tanker er</p><p>høyere enn dine, mine tanker,</p><p>ja, som himlen over jorden her.</p><p>Kun av kjærlighet hans hjerte banker.</p><h3>Refreng</h3><p>Herrens vei, du og jeg</p><p>kan ei skjønne eller fatte.</p><p>Herrens ord er lyset på vår sti.</p><p>Tro det, og du finner skjulte skatter!</p>";

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
      ?.map((v) =>
        [
          v.title && `<h3>${v.title}</h3>`,
          v.text && `<p>${v.text?.split("\n").join("</p><p>")}</p>`,
        ].join(""),
      )
      .join("");
  },
  set(value) {
    if (!lyrics.value || !value) return;
    const verseStrings = value
      .replaceAll("<h3>", "\n<h3>")
      .split("\n")
      .filter(Boolean);
    const verseObjects = verseStrings
      .filter((verseString) => verseString !== "<p></p>")
      .map((verseString) => {
        const title = verseString.match(/<h3>(.*?)<\/h3>/)?.[1];
        const text = verseString
          .replaceAll(/<h3>(.*?)<\/h3>/g, "")
          .split("</p><p>")
          .join("\n")
          .replaceAll(/<(\/*)(.+)(\/*)>/g, "");
        return { title, text };
      });

    lyrics.value.verses = verseObjects;
  },
});

const saving = ref(false);
async function saveLyrics() {
  if (!lyrics.value) return;
  saving.value = true;

  // Default values
  lyrics.value.longCopyright ||= DEFAULT_LONG_COPYRIGHT;
  lyrics.value.source = "Manual"; // Source is always manual in this case

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
const composers = ref<ContributorModel[]>();
const lyricists = ref<ContributorModel[]>();

// Initially set composer and lyricist based on the lyrics
watch(lyrics, async (l) => {
  if (!l) return;
  if (!l.composers?.length || !l.lyricists?.length) return;

  composers.value = await Promise.all(
    l.composers.map((c) =>
      new ContributorApi().contributorIdGet({
        id: c,
      }),
    ),
  );

  lyricists.value = await Promise.all(
    l.lyricists.map((c) =>
      new ContributorApi().contributorIdGet({
        id: c,
      }),
    ),
  );
});

watch([composers, lyricists], ([c, l]) => {
  if (!lyrics.value) return;
  if (c) {
    lyrics.value.composers = Array.from(new Set(c.map((i) => i.id)));
  }
  if (l) {
    lyrics.value.lyricists = Array.from(new Set(l.map((i) => i.id)));
  }
});

watchDebounced(
  contributorSearch,
  async (search) => {
    if (search === "" || !search) return;
    contributors.value = await new ContributorApi().contributorSearchTermGet({
      term: search,
    });
  },
  { debounce: 100, immediate: true },
);

// Delete lyrics dialog
const confirmDelete = useConfirmDialog();
confirmDelete.onConfirm(async () => {
  try {
    await new LyricsApi().lyricsIdDelete({
      id: Number(route.params.id),
    });
    navigateTo({ name: "lyrics" });
  } catch {
    throw createError("Failed to delete lyrics");
  }
});

function deleteLyrics() {
  if (!lyrics.value) return;
  confirmDelete.reveal();
}
</script>

<template>
  <div class="relative">
    <template v-if="lyrics">
      <div
        class="sticky top-10 z-10 flex items-center justify-between gap-6 bg-gradient-to-b from-background-1 from-60% to-[transparent]"
      >
        <PageHeading
          contenteditable
          @blur="lyrics.songTitle = $event.target.innerText"
        >
          {{ lyrics.songTitle }}
        </PageHeading>
        <div class="flex items-center gap-4">
          <ButtonStyled intent="tertiary" @click="deleteLyrics">
            {{ $t("edit.delete") }}
          </ButtonStyled>
          <ButtonStyled :loading="saving" intent="primary" @click="saveLyrics">
            {{ $t("lyrics.save") }}
          </ButtonStyled>
        </div>
      </div>
      <div class="grid gap-8 lg:grid-cols-2 lg:grid-rows-1">
        <div class="row-start-1 flex flex-col gap-4 md:col-start-2">
          <ComboSearchBox
            v-model:search="contributorSearch"
            v-model="composers"
            :label="$t('track.details.composer')"
            :options="contributors"
            :option-key="(c) => c.id"
            :display-value="(option) => option.name!"
          >
            <template #option="{ option, selected }">
              {{ option.name }}
              <NuxtIcon v-if="selected" name="icon.checkmark" />
            </template>
          </ComboSearchBox>
          <ComboSearchBox
            v-model:search="contributorSearch"
            v-model="lyricists"
            :label="$t('track.details.lyricist')"
            :options="contributors"
            :option-key="(c) => c.id"
            :display-value="(option) => option.name!"
          >
            <template #option="{ option, selected }">
              {{ option.name }}
              <NuxtIcon v-if="selected" name="icon.checkmark" />
            </template>
          </ComboSearchBox>
        </div>
        <div class="flex flex-col gap-8">
          <LyricsEditor
            v-model="verses"
            :placeholder="EDITOR_PLACEHOLDER"
            class="md:col-start-1 md:row-start-1"
          />
          <div class="flex flex-col gap-1">
            <label for="long-copyright">Long copyright</label>
            <textarea
              id="long-copyright"
              v-model="lyrics.longCopyright"
              :placeholder="DEFAULT_LONG_COPYRIGHT"
              class="w-full truncate rounded-lg border border-label-separator bg-background-2 px-4 py-2"
              rows="1"
            ></textarea>
          </div>
        </div>
      </div>
      <DialogBase
        :show="confirmDelete.isRevealed.value"
        title="Delete lyrics?"
        description="The lyrics will be permanently deleted."
        hide-button
        @close="confirmDelete.cancel"
      >
        <div class="flex justify-end gap-2">
          <ButtonStyled intent="secondary" @click="confirmDelete.cancel">
            Cancel
          </ButtonStyled>
          <ButtonStyled intent="primary" @click="confirmDelete.confirm">
            Yes, delete
          </ButtonStyled>
        </div>
      </DialogBase>
    </template>
  </div>
</template>
