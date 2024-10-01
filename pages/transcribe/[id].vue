<script setup lang="ts">
import type {
  LanguageEnum,
  TrackTranslationTranscriptionSegment,
} from "@bcc-code/bmm-sdk-fetch";
import { PublishedFilter, TrackApi } from "@bcc-code/bmm-sdk-fetch";
import { diffWordsWithSpace } from "diff";
import { MediaPlayerStatus } from "~/plugins/mediaPlayer/mediaPlayer";
import transcriptionStorageKey from "~/utils/transcription";

definePageMeta({
  middleware: ["transcription-manager"],
});

const { t } = useI18n();
setTitle(() => t("nav.transcribe"));

const route = useRoute("transcribe-id");

const { data: track } = useTrack({
  id: Number(route.params.id),
  unpublished: PublishedFilter.Show,
});

const { $mediaPlayer } = useNuxtApp();
onMounted(() => {
  if ($mediaPlayer.currentTrack.value?.id !== Number(route.params.id)) {
    $mediaPlayer.stop();
  }
});

const { contentLanguages } = useContentLanguageStore();
const transcriptionLanguage = ref<LanguageEnum>();
const language = computed({
  get() {
    return (
      transcriptionLanguage.value ??
      $mediaPlayer.currentTrack.value?.language ??
      ($mediaPlayer.currentTrack.value?.transcriptionLanguages ?? [])
        .filter((c) => c !== "zxx")
        .at(0) ??
      track.value?.language ??
      (track.value?.transcriptionLanguages ?? [])
        .filter((c) => c !== "zxx")
        .at(0) ??
      contentLanguages.filter((c) => c !== "zxx").at(0)!
    );
  },
  async set(value) {
    if (value === transcriptionLanguage.value) return;
    transcriptionLanguage.value = value;

    if (!$mediaPlayer.currentTrack.value) return;

    try {
      const { data: reloadedTrack } = await useTrackIDWithLanguage(value, {
        id: $mediaPlayer.currentTrack.value.id,
        unpublished: PublishedFilter.Show,
      });
      if (!reloadedTrack.value) return;
      $mediaPlayer.replaceCurrent(reloadedTrack.value);
    } catch (err) {
      // TODO: Show an error message to the user
      console.error(err);
    }
  },
});

const isPlaying = computed(
  () => $mediaPlayer.status.value === MediaPlayerStatus.Playing,
);

const {
  status,
  transcription,
  editableTranscription,
  currentTranscriptionSegment,
  currentEditableTranscriptionSegment,
  setTranscriptionSegmentText,
  playCurrentTranscriptionSegment,
  playTranscriptionSegment,
  toggleDeletion,
  deletedTranscriptionSegments,
  refetchTranscription,
} = useTranscriptionTool({
  trackId: Number(route.params.id),
  language,
});

function onStartTranscriptionPlayback() {
  if (track.value?.id !== $mediaPlayer.currentTrack.value?.id) {
    $mediaPlayer.setQueue([track.value!]);
    playCurrentTranscriptionSegment();
  }
  if ($mediaPlayer.status.value === MediaPlayerStatus.Playing)
    $mediaPlayer.pause();
  else if ($mediaPlayer.status.value === MediaPlayerStatus.Paused)
    $mediaPlayer.play();
  else {
    $mediaPlayer.setQueue([track.value!]);
    playCurrentTranscriptionSegment();
  }
}

function getDiff(
  oldItem: TrackTranslationTranscriptionSegment | undefined,
  newItem: TrackTranslationTranscriptionSegment | undefined,
) {
  if (!oldItem?.text || !newItem?.text) return [];
  return diffWordsWithSpace(oldItem.text, newItem.text);
}

const editing = ref<boolean[]>([]);

function focusTranscriptionSegment(index: number) {
  const element = document.querySelector<HTMLParagraphElement>(
    `[data-transcription-segment-index="${index}"]`,
  );
  if (element) element.focus();
}

const focusedIndex = ref(0);

function onArrowUp() {
  if (focusedIndex.value > 0) {
    focusedIndex.value -= 1;
    focusTranscriptionSegment(focusedIndex.value);
  }
}

function onArrowDown() {
  if (focusedIndex.value < transcription.value!.length - 1) {
    focusedIndex.value += 1;
    focusTranscriptionSegment(focusedIndex.value);
  }
}

function handleFocus(index: number) {
  editing.value[index] = true;
}

const hasInvalidIds = computed(() => {
  if (!editableTranscription.value) return false;
  return editableTranscription.value.filter((item) => item.id === 0).length > 1;
});

const saving = ref(false);
async function saveTranscription() {
  if (!track.value) return;
  if (hasInvalidIds.value) return;
  saving.value = true;

  // Remove segments marked for deletion from transcription
  if (deletedTranscriptionSegments.value.length) {
    deletedTranscriptionSegments.value.forEach((item) => {
      editableTranscription.value.splice(
        editableTranscription.value.indexOf(item),
        1,
      );
    });
  }

  try {
    await new TrackApi().trackIdTranscriptionLanguagePost({
      id: Number(route.params.id),
      language: language.value,
      trackTranslationTranscriptionSegment: editableTranscription.value,
    });
    await refetchTranscription();

    localStorage.setItem(
      `${transcriptionStorageKey(Number(route.params.id), language.value)}:saved`,
      JSON.stringify(true),
    );
  } catch (err) {
  } finally {
    saving.value = false;
  }
}

const copiedToClipboard = ref(false);
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(
      editableTranscription.value.map((item) => item.text).join(" "),
    );
    copiedToClipboard.value = true;
  } catch (err) {
  } finally {
    setTimeout(() => {
      copiedToClipboard.value = false;
    }, 2000);
  }
}
</script>

<template>
  <div class="relative h-full">
    <div v-if="track">
      <header
        class="mb-12 mt-10 flex flex-wrap items-center justify-between gap-4"
      >
        <PageHeading>{{ track.title }}</PageHeading>
        <div class="flex flex-col items-end gap-2">
          <div class="flex gap-2">
            <ButtonStyled intent="tertiary" @click="copyToClipboard">
              Copy to clipboard
            </ButtonStyled>
            <DialogPlain :show="copiedToClipboard">
              <p class="p-6">Copied to clipboard</p>
            </DialogPlain>
            <ButtonStyled
              intent="primary"
              class="relative"
              :loading="saving"
              :disabled="hasInvalidIds"
              @click="saveTranscription"
            >
              {{ $t("transcription.save") }}
            </ButtonStyled>
          </div>
          <span v-if="hasInvalidIds" class="type-subtitle-2 text-label-3">
            Some transcription segments have the same ID, and can therefore not
            be edited.
          </span>
        </div>
      </header>
      <div class="flex items-center gap-2">
        <ButtonStyled
          intent="primary"
          :icon="isPlaying ? 'icon.pause.small' : 'icon.play.small'"
          @click="onStartTranscriptionPlayback"
        />
        <DropdownMenu v-if="language" placement="bottom-end">
          <ButtonStyled intent="tertiary">
            {{ getLocalizedLanguageName(language) }}
            <NuxtIcon name="icon.chevron.down" class="ml-2" />
          </ButtonStyled>
          <template #items>
            <DropdownMenuGroup>
              <DropdownMenuItem
                v-for="lang in track.transcriptionLanguages"
                :key="lang"
                :title="getLocalizedLanguageName(lang)"
                @click="language = lang"
              />
            </DropdownMenuGroup>
          </template>
        </DropdownMenu>
      </div>

      <div
        class="type-paragraph-1 relative mt-12 grid gap-x-6 p-4 text-label-1 lg:grid-cols-2 2xl:-mx-10"
      >
        <template v-if="status === 'success'">
          <div class="md:p-6">
            <p class="type-title-1 mb-4">{{ t("transcription.original") }}</p>
            <p
              v-for="item in transcription"
              :key="item.id"
              :class="[
                'my-4 whitespace-pre-wrap rounded-2xl border transition-all duration-300 ease-out',
                ,
                {
                  '-mx-6 border-label-separator bg-background-2 px-6 py-4 shadow-sm':
                    item == currentTranscriptionSegment,
                  'border-[transparent]': item != currentTranscriptionSegment,
                },
              ]"
            >
              <span class="type-title-3 block h-6 text-label-4">
                {{
                  [item.start, item.end]
                    .filter((val) => val !== undefined)
                    .map((val) => formatTime(val!))
                    .join(" - ")
                }}
              </span>
              <span>{{ item.text }}</span>
            </p>
          </div>
          <div class="md:p-6">
            <p class="type-title-1 mb-4">{{ t("transcription.edit") }}</p>
            <div
              v-for="(item, index) in editableTranscription"
              :key="item.id"
              :class="[
                'my-4 grid grid-cols-[1fr_auto] items-baseline rounded-2xl border transition-all duration-300 ease-out',
                {
                  '-mx-6 border-label-separator bg-background-2 px-6 py-4 shadow-sm':
                    item == currentEditableTranscriptionSegment,
                  'border-[transparent]':
                    item != currentEditableTranscriptionSegment,
                  'opacity-25': deletedTranscriptionSegments.includes(item),
                },
              ]"
            >
              <div
                class="type-title-3 col-span-full flex h-6 items-center justify-between gap-2 text-label-4"
              >
                <button
                  class="-ml-4 flex items-center gap-1"
                  @click="playTranscriptionSegment(item)"
                >
                  <NuxtIcon name="icon.play" />
                  <span>
                    {{
                      [item.start, item.end]
                        .filter((val) => val !== undefined)
                        .map((val) => formatTime(val!))
                        .join(" - ")
                    }}
                  </span>
                </button>
                <button
                  v-if="!hasInvalidIds"
                  :class="[
                    'flex items-center gap-0.5 rounded-full border px-1.5 hover:text-label-3',
                    {
                      'border-label-separator':
                        !deletedTranscriptionSegments.includes(item),
                      'border-label-4':
                        deletedTranscriptionSegments.includes(item),
                    },
                  ]"
                  @click="toggleDeletion(item)"
                >
                  <template v-if="!deletedTranscriptionSegments.includes(item)">
                    <NuxtIcon name="icon.close.small" class="opacity-50" />
                    {{ t("transcription.deleteSegment") }}
                  </template>
                  <template v-else>
                    <NuxtIcon name="icon.repeat" class="opacity-50" />
                    {{ t("transcription.undeleteSegment") }}
                  </template>
                </button>
              </div>
              <p
                :class="[
                  'col-start-1 row-start-2 whitespace-pre-wrap',
                  {
                    'opacity-0': !editing[index],
                  },
                ]"
                :contenteditable="!hasInvalidIds"
                :data-transcription-segment-index="index"
                @input="
                  setTranscriptionSegmentText(
                    item,
                    ($event.target as HTMLParagraphElement).innerText,
                  )
                "
                @focus="handleFocus(index)"
                @blur="editing[index] = false"
                @keydown.up="onArrowUp"
                @keydown.down="onArrowDown"
              >
                {{ item.text }}
              </p>
              <p
                v-if="!editing[index]"
                class="col-start-1 row-start-2 whitespace-pre-wrap"
                @click="editing[index] = true"
              >
                <span
                  v-for="change in getDiff(item, transcription?.[index])"
                  :key="change.value"
                  :class="{
                    'bg-[red]/10 text-[red]': change.added,
                    'bg-[green]/10 text-[green]': change.removed,
                  }"
                >
                  {{ change.value }}
                </span>
              </p>
            </div>
          </div>
        </template>
        <template v-else-if="status === 'pending'">
          <NuxtIcon
            name="spinner"
            class="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2"
          />
        </template>
      </div>
    </div>
    <NuxtIcon
      v-else
      name="spinner"
      class="absolute left-1/2 top-1/2 size-32 -translate-x-1/2 -translate-y-1/2"
    />
  </div>
</template>
