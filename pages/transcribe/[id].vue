<script setup lang="ts">
import { MediaPlayerStatus } from "~/plugins/mediaPlayer/mediaPlayer";

const { t } = useI18n();
setTitle(() => t("nav.transcribe"));

const route = useRoute("transcribe-id");

const { data: track } = useTrack({ id: Number(route.params.id) });

const {
  currentIndex,
  transcription,
  editableTranscription,
  currentTranscriptionItem,
  currentEditableTranscriptionItem,
  goToNextTranscriptionItem,
  goToPreviousTranscriptionItem,
} = useTranscriptionTool({ trackId: Number(route.params.id) });

const { $mediaPlayer } = useNuxtApp();
const mediaPlayerPlaying = computed(
  () => $mediaPlayer.status.value === MediaPlayerStatus.Playing,
);
onMounted(() => {
  if ($mediaPlayer.currentTrack.value?.id !== Number(route.params.id)) {
    $mediaPlayer.stop();
  }
});

function onStartTranscriptionPlayback() {
  if (track.value?.id !== $mediaPlayer.currentTrack.value?.id) {
    $mediaPlayer.setQueue([track.value!]);
  }
  if ($mediaPlayer.status.value === MediaPlayerStatus.Playing)
    $mediaPlayer.pause();
  else if ($mediaPlayer.status.value === MediaPlayerStatus.Paused)
    $mediaPlayer.play();
  else $mediaPlayer.setQueue([track.value!]);
}
</script>

<template>
  <div>
    <div v-if="track && transcription?.length">
      <header class="mb-12 mt-10 flex items-center justify-between gap-4">
        <PageHeading>{{ track.title }}</PageHeading>
        <ButtonStyled intent="tertiary">
          {{ $t("transcription.markAsDone") }}
        </ButtonStyled>
      </header>
      <div
        class="type-paragraph-1 mt-12 grid grid-cols-2 gap-4 rounded-[48px] border border-label-separator bg-background-1 p-4 text-label-1 shadow-sm 2xl:-mx-10"
      >
        <div class="rounded-[28px] p-6">
          <p class="type-title-1 mb-4">{{ t("transcription.original") }}</p>
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
          <p class="type-title-1 mb-4">{{ t("transcription.edit") }}</p>
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
                editableTranscription &&
                editableTranscription[currentIndex] &&
                currentEditableTranscriptionItem &&
                currentEditableTranscriptionItem.text
              "
              :key="currentIndex"
              type="text"
              class="w-full bg-[transparent]"
              :value="currentEditableTranscriptionItem.text"
              @input="
                editableTranscription[currentIndex]!.text = (
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
              @click="onStartTranscriptionPlayback"
            >
              <NuxtIcon
                :name="mediaPlayerPlaying ? 'icon.pause.small' : 'icon.play'"
                class="text-xl"
              />
            </ButtonStyled>

            <!-- <RadioButtons
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
            </RadioButtons> -->

            <div class="ml-auto flex items-center gap-3">
              <ButtonStyled
                v-if="currentIndex > 0"
                size="small"
                intent="tertiary"
                @click="goToPreviousTranscriptionItem"
              >
                {{ $t("transcription.previousSection") }}
              </ButtonStyled>
              <ButtonStyled
                v-if="editableTranscription"
                size="small"
                intent="primary"
                :disabled="currentIndex >= editableTranscription.length - 1"
                @click="goToNextTranscriptionItem"
              >
                {{ $t("transcription.nextSection") }}
              </ButtonStyled>
            </div>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>
