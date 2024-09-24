<script setup lang="ts">
import type { TrackTranslationTranscriptionSegment } from "@bcc-code/bmm-sdk-fetch";
import { diffWordsWithSpace } from "diff";
import { MediaPlayerStatus } from "~/plugins/mediaPlayer/mediaPlayer";

// Navigate to home if user is not transcription manager
// definePageMeta({
//   middleware: [
//     async (_from, _to, next) => {
//       const { data: currentUser } = await useCurrentUser();
//       if (!currentUser.value.roles?.includes("ROLE_TRANSCRIPTION_MANAGER"))
//         return navigateTo("/");
//       return next();
//     },
//   ],
// });

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
  setTranscriptionItemText,
  playCurrentTranscriptionItem,
  deleteTranscriptionItem,
} = useTranscriptionTool({ trackId: Number(route.params.id) });

const { $mediaPlayer } = useNuxtApp();
onMounted(() => {
  if ($mediaPlayer.currentTrack.value?.id !== Number(route.params.id)) {
    $mediaPlayer.stop();
  }
});

function onStartTranscriptionPlayback() {
  if (track.value?.id !== $mediaPlayer.currentTrack.value?.id) {
    $mediaPlayer.setQueue([track.value!]);
    playCurrentTranscriptionItem();
  }
  if ($mediaPlayer.status.value === MediaPlayerStatus.Playing)
    $mediaPlayer.pause();
  else if ($mediaPlayer.status.value === MediaPlayerStatus.Paused)
    $mediaPlayer.play();
  else {
    $mediaPlayer.setQueue([track.value!]);
    playCurrentTranscriptionItem();
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

function focusTranscriptionItem(index: number) {
  const element = document.querySelector<HTMLParagraphElement>(
    `[data-transcription-item-index="${index}"]`,
  );
  if (element) element.focus();
}

function onArrowUp() {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1;
    focusTranscriptionItem(currentIndex.value);
  }
}

function onArrowDown() {
  if (currentIndex.value < transcription.value!.length - 1) {
    currentIndex.value += 1;
    focusTranscriptionItem(currentIndex.value);
  }
}

function handleFocus(index: number) {
  currentIndex.value = index;
  editing.value[index] = true;
  playCurrentTranscriptionItem();
}
</script>

<template>
  <div>
    <div v-if="track && transcription?.length">
      <header class="mb-12 mt-10 flex items-center justify-between gap-4">
        <PageHeading>{{ track.title }}</PageHeading>
        <div class="flex items-center gap-2">
          <ButtonStyled
            intent="primary"
            icon="icon.play.small"
            @click="onStartTranscriptionPlayback"
          />
          <ButtonStyled intent="tertiary">
            {{ $t("transcription.markAsDone") }}
          </ButtonStyled>
        </div>
      </header>
      <div
        class="type-paragraph-1 relative mt-12 grid grid-cols-2 gap-6 p-4 text-label-1 2xl:-mx-10"
      >
        <div class="p-6">
          <p class="type-title-1 mb-4">{{ t("transcription.original") }}</p>
          <p
            v-for="item in transcription"
            :key="item.id"
            :class="[
              'rounded-2xl border transition-all duration-300 ease-out',
              ,
              {
                '-mx-6 border-label-separator bg-background-2 px-6 py-4 shadow-sm':
                  item == currentTranscriptionItem,
                'border-[transparent]': item != currentTranscriptionItem,
              },
            ]"
          >
            {{ item.text }}
          </p>
        </div>
        <div class="p-6">
          <p class="type-title-1 mb-4">{{ t("transcription.edit") }}</p>
          <div
            v-for="(item, index) in editableTranscription"
            :key="item.id"
            :class="[
              'grid grid-cols-[1fr_auto] rounded-2xl border transition-all duration-300 ease-out',
              {
                '-mx-6 border-label-separator bg-background-2 px-6 py-4 shadow-sm':
                  item == currentEditableTranscriptionItem,
                'border-[transparent]':
                  item != currentEditableTranscriptionItem,
              },
            ]"
          >
            <p
              :class="[
                'col-start-1 row-start-1',
                {
                  'opacity-0': !editing[index],
                },
              ]"
              contenteditable
              :data-transcription-item-index="index"
              @input="
                setTranscriptionItemText(
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
              class="col-start-1 row-start-1"
              @click="editing[index] = true"
            >
              <span
                v-for="change in getDiff(item, transcription[index])"
                :key="change.value"
                :class="{
                  'bg-[red]/10 text-[red]': change.added,
                  'bg-[green]/10 text-[green]': change.removed,
                }"
              >
                {{ change.value }}
              </span>
            </p>
            <button
              class="type-paragraph-2 flex items-center gap-1 text-label-3"
              @click="deleteTranscriptionItem(item)"
            >
              <NuxtIcon name="icon.close" class="opacity-75" />
              {{ t("transcription.deleteItem") }}
            </button>
          </div>
        </div>
      </div>
      <!-- <div
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
      </div> -->
    </div>
  </div>
</template>
