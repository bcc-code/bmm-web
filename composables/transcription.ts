import { TrackApi } from "@bcc-code/bmm-sdk-fetch";
import type { TrackIdTranscriptionGetRequest, TrackTranslationTranscriptionSegment } from "@bcc-code/bmm-sdk-fetch";

export function useTrackTranscription(options: TrackIdTranscriptionGetRequest, immediate = false) {
  return useLazyAsyncData(
    `transcription-${options.id}`,
    () => new TrackApi().trackIdTranscriptionGet(options),
    { immediate },
  );
}


interface UseTranscriptionToolOptions {
  trackId: number
}

export function useTranscriptionTool(options: UseTranscriptionToolOptions) {
  const { trackId } = options

  const { data: transcription } = useTrackTranscription({ id: trackId }, true)
  const { $mediaPlayer } = useNuxtApp()

  // copy transcription
  const editableTranscription = useLocalStorage<TrackTranslationTranscriptionSegment[]>(`transcription:${trackId}`, () => [], {
    writeDefaults: false
  })
  watch(transcription, (_transcription) => {
    if (editableTranscription.value.length) return
    if (_transcription?.length) {
      editableTranscription.value = structuredClone(toRaw(_transcription))
    }
  }, { once: true })

  const currentIndex = ref(0)

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
      if (!indexOfCurrent || indexOfCurrent === -1) return;
      currentIndex.value = indexOfCurrent;
    },
  );

  const currentTranscriptionItem = computed(() => {
    if (!transcription.value) return null
    return transcription.value[currentIndex.value] || transcription.value[currentIndex.value - 1]
  })

  const currentEditableTranscriptionItem = computed(() => {
    if (!editableTranscription.value) return null
    return editableTranscription.value[currentIndex.value]
  })

  function playCurrentTranscriptionItem() {
    if (currentTranscriptionItem.value && currentTranscriptionItem.value.start) {
      $mediaPlayer.currentPosition.value = currentTranscriptionItem.value.start
    }
  }

  function goToNextTranscriptionItem() {
    if (!transcription.value) return;

    currentIndex.value = Math.min(
      currentIndex.value + 1,
      transcription.value.length - 1,
    );

    playCurrentTranscriptionItem();
  }

  function goToPreviousTranscriptionItem() {
    currentIndex.value = Math.max(currentIndex.value - 1, 0);
    playCurrentTranscriptionItem();
  }


  return {
    currentIndex,
    transcription,
    editableTranscription,
    currentTranscriptionItem,
    currentEditableTranscriptionItem,
    playCurrentTranscriptionItem,
    goToNextTranscriptionItem,
    goToPreviousTranscriptionItem,
  }
}