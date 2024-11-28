<script lang="ts">
export const DEFAULT_LONG_COPYRIGHT =
  "© Stiftelsen Skjulte Skatters Forlag, Norway. All rights reserved.";
export const EDITOR_PLACEHOLDER =
  "<h3>Vers 1</h3><p>Herrens veier, Herrens tanker er</p><p>høyere enn dine, mine tanker,</p><p>ja, som himlen over jorden her.</p><p>Kun av kjærlighet hans hjerte banker.</p><h3>Refreng</h3><p>Herrens vei, du og jeg</p><p>kan ei skjønne eller fatte.</p><p>Herrens ord er lyset på vår sti.</p><p>Tro det, og du finner skjulte skatter!</p>";
</script>

<script setup lang="ts">
// eslint-disable-next-line import/first
import { ContributorApi, LyricsApi } from "@bcc-code/bmm-sdk-fetch";
// eslint-disable-next-line import/first
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
    if (!lyrics.value?.verses) return "";
    return lyricsVersesToHtml(lyrics.value.verses);
  },
  set(value) {
    if (!lyrics.value || !value) return;
    const html = lyricsCleanupHtml(value);
    const lyricsVerses = lyricsVersesFromHtml(html);
    lyrics.value.verses = lyricsVerses;
  },
});

const yearPublished = ref<number | null>();
const saving = ref(false);
const editorRenderingKey = ref(0);
async function saveLyrics() {
  if (!lyrics.value) return;
  saving.value = true;

  // Default values
  if (yearPublished.value) {
    lyrics.value.yearPublished = yearPublished.value;
  }

  try {
    await new LyricsApi().lyricsIdPut({
      id: Number(route.params.id),
      lyrics: lyrics.value,
    });
  } catch {
  } finally {
    saving.value = false;
    editorRenderingKey.value += 1;
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

  yearPublished.value = l.yearPublished;
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
    contributors.value =
      await new ContributorApi().contributorSearchUnpublishedTermGet({
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

function useDefaultLongCopyright() {
  if (!lyrics.value) return;
  lyrics.value.longCopyright = DEFAULT_LONG_COPYRIGHT;
}
</script>

<template>
  <div>
    <template v-if="lyrics">
      <header class="mb-8">
        <div
          class="flex items-center justify-between gap-6 bg-gradient-to-b from-background-1 from-60% to-[transparent]"
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
            <ButtonStyled
              :loading="saving"
              intent="primary"
              @click="saveLyrics"
            >
              {{ $t("lyrics.save") }}
            </ButtonStyled>
          </div>
        </div>
        <I18nText
          class="type-paragraph-1 flex flex-wrap items-center gap-2 text-label-2"
          i18n-key="lyrics.paste-instructions"
        >
          <template #shortcut>
            <KeyboardShortcut :keys="['meta', 'shift', 'v']" />
          </template>
        </I18nText>
      </header>
      <div class="grid gap-8 lg:grid-cols-2 lg:grid-rows-1">
        <div class="row-start-1 flex flex-col gap-6 md:col-start-2">
          <ComboSearchBox
            v-model:search="contributorSearch"
            v-model="lyricists"
            :label="$t('lyrics.lyricist')"
            :options="contributors"
            :option-key="(c) => c.id"
            :display-value="(option) => option.name!"
          >
            <template #option="{ option, selected }">
              <div class="flex grow items-baseline gap-2">
                <span>{{ option.name }}</span>
                <div
                  class="type-subtitle-3 flex items-baseline gap-0.5 text-label-3"
                >
                  <span>{{ option.interpretReferences }}</span>
                  ·
                  <span>{{ option.otherReferences }}</span>
                </div>
                <NuxtIcon
                  :class="[
                    'ml-auto',
                    { 'opacity-100': selected, 'opacity-0': !selected },
                  ]"
                  name="icon.checkmark"
                />
              </div>
            </template>
          </ComboSearchBox>
          <ComboSearchBox
            v-model:search="contributorSearch"
            v-model="composers"
            :label="$t('lyrics.composer')"
            :options="contributors"
            :option-key="(c) => c.id"
            :display-value="(option) => option.name!"
          >
            <template #option="{ option, selected }">
              <div class="flex grow items-baseline gap-2">
                <span>{{ option.name }}</span>
                <div
                  class="type-subtitle-3 flex items-baseline gap-0.5 text-label-3"
                >
                  <span>{{ option.interpretReferences }}</span>
                  ·
                  <span>{{ option.otherReferences }}</span>
                </div>
                <NuxtIcon
                  :class="[
                    'ml-auto',
                    { 'opacity-100': selected, 'opacity-0': !selected },
                  ]"
                  name="icon.checkmark"
                />
              </div>
            </template>
          </ComboSearchBox>
          <div>
            <label
              class="type-subtitle-2 mb-1 block text-label-1"
              for="publishing-year"
            >
              Publishing year
            </label>
            <input
              id="publishing-year"
              v-model="yearPublished"
              type="number"
              class="w-24 truncate rounded-lg border border-label-separator bg-background-2 px-4 py-2"
              :placeholder="new Date().getFullYear().toString()"
            />
          </div>
          <div v-if="lyrics.originalUrl">
            <div class="type-subtitle-3 text-label-1">
              Original telegra.ph URL
            </div>
            <a
              :href="lyrics.originalUrl"
              target="_blank"
              class="type-paragraph-1 underline"
            >
              {{ lyrics.originalUrl }}
            </a>
          </div>
        </div>
        <div class="flex flex-col gap-8">
          <LyricsEditor
            :key="editorRenderingKey"
            v-model="verses"
            :placeholder="EDITOR_PLACEHOLDER"
            class="md:col-start-1 md:row-start-1"
          />
          <div class="flex flex-col gap-1">
            <div class="flex items-center justify-between gap-2">
              <label for="long-copyright">
                {{ $t("lyrics.long-copyright") }}
              </label>
              <button
                class="type-subtitle-3 flex items-center gap-1 rounded-md border border-label-separator bg-background-2 pl-1 pr-2 text-label-3 hover:border-label-4 hover:text-label-2"
                @click="useDefaultLongCopyright"
              >
                <NuxtIcon name="icon.add" class="opacity-50" />
                <span>Default SSSF copyright</span>
              </button>
            </div>
            <textarea
              id="long-copyright"
              v-model="lyrics.longCopyright"
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
