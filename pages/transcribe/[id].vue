<script setup lang="ts">
import type { TrackTranslationTranscriptionSegment } from "@bcc-code/bmm-sdk-fetch";
import { MediaPlayerStatus } from "~/plugins/mediaPlayer/mediaPlayer";

const { t } = useI18n();
setTitle(() => t("nav.transcribe"));

const route = useRoute("transcribe-id");

const { data: track } = useTrack({ id: Number(route.params.id) });

const {
  goToNextTranscriptionItem,
  goToPreviousTranscriptionItem,
  playCurrentTranscriptionItem,
  transcription,
  editableTranscription,
  currentIndex,
} = useTranscriptionTool(Number(route.params.id));

const { $mediaPlayer } = useNuxtApp();
const mediaPlayerPlaying = computed(
  () => $mediaPlayer.status.value === MediaPlayerStatus.Playing,
);

function onPlayClicked() {
  if ($mediaPlayer.status.value === MediaPlayerStatus.Playing)
    $mediaPlayer.pause();
  else if ($mediaPlayer.status.value === MediaPlayerStatus.Paused)
    $mediaPlayer.play();
  else $mediaPlayer.setQueue([track.value!]);
}

function isWithinCurrentTime(item: TrackTranslationTranscriptionSegment) {
  const hasStarted =
    !!item.start && $mediaPlayer.currentPosition.value >= item.start;
  const hasEnded = !!item.end && $mediaPlayer.currentPosition.value > item.end;

  return hasStarted && !hasEnded;
}

watch(
  () => $mediaPlayer.currentPosition.value,
  (pos) => {
    if (
      transcription.value?.length &&
      transcription.value[0]?.start &&
      transcription.value[0].start > pos
    )
      return;

    const indexOfCurrent = transcription.value?.findIndex(isWithinCurrentTime);
    if (!indexOfCurrent) return;
    currentIndex.value = indexOfCurrent;
  },
);

// const playbackSpeed = ref(1);
</script>

<template>
  <div>
    <div v-if="track && transcription?.length">
      <header class="mb-12 mt-10 flex items-center justify-between gap-4">
        <PageHeading>{{ track.title }}</PageHeading>
        <ButtonStyled>Mark as done</ButtonStyled>
      </header>
      <div
        class="type-paragraph-1 mt-12 grid grid-cols-2 gap-4 rounded-[48px] border border-label-separator bg-background-1 p-4 text-label-1 shadow-sm"
      >
        <div class="rounded-[28px] p-6">
          <p class="type-title-1 mb-4">Original</p>
          <Transition
            enter-active-class="transition ease-out-expo duration-500"
            enter-from-class="opacity-0 translate-x-2"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="transition ease-out-expo duration-500 absolute"
            leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 -translate-x-2"
          >
            <p
              v-if="currentTranscriptionItem && currentTranscriptionItem.text"
              :key="currentIndex"
            >
              {{ currentTranscriptionItem.text }}
            </p>
          </Transition>
        </div>
        <div class="rounded-[28px] bg-background-2 p-6">
          <p class="type-title-1 mb-4">Edit</p>
          <Transition
            enter-active-class="transition ease-out-expo duration-500"
            enter-from-class="opacity-0 translate-x-2"
            enter-to-class="opacity-100 translate-x-0"
            leave-active-class="transition ease-out-expo duration-500 absolute"
            leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 -translate-x-2"
          >
            <input
              v-if="
                currentTranscriptionItemCopy &&
                currentTranscriptionItemCopy.text
              "
              :key="currentIndex"
              type="text"
              class="w-full bg-[transparent]"
              :value="currentTranscriptionItemCopy.text"
              @input="
                editableTranscription[currentIndex].text = (
                  $event.target as HTMLInputElement
                ).value
              "
            />
          </Transition>
          <footer class="mt-4 flex items-center gap-3">
            <ButtonStyled
              size="small"
              intent="primary"
              class="!p-1.5"
              @click="onPlayClicked"
            >
              <NuxtIcon
                :name="mediaPlayerPlaying ? 'icon.pause.small' : 'icon.play'"
                class="text-xl"
              />
            </ButtonStyled>
            <!--
            <RadioButtons
              v-model="playbackSpeed"
              :options="[1, 1.25, 1.5, 1.75, 2]"
              class="flex rounded-full bg-background-1 px-2.5"
            >
              <template #option="{ option, isSelected }">
                <span
                  :class="[
                    'cursor-pointer p-1.5',
                    {
                      'type-subtitle-2 text-label-3': !isSelected,
                      'type-title-2': isSelected,
                    },
                  ]"
                >
                  {{ option }}x
                </span>
              </template>
            </RadioButtons>
            -->
            <div class="ml-auto flex items-center gap-3">
              <ButtonStyled
                v-if="currentIndex > 0"
                size="small"
                intent="secondary"
                @click="goToPreviousTranscriptionItem"
              >
                Previous section
              </ButtonStyled>
              <ButtonStyled
                size="small"
                intent="primary"
                :disabled="currentIndex >= transcriptionCopy?.length - 1"
                @click="goToNextTranscriptionItem"
              >
                Next section
              </ButtonStyled>
            </div>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>
