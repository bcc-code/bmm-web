import { TrackApi } from "@bcc-code/bmm-sdk-fetch";
import type { TrackIdTranscriptionGetRequest, TrackTranslationTranscriptionSegment } from "@bcc-code/bmm-sdk-fetch";

export function useTrackTranscription(options: TrackIdTranscriptionGetRequest, immediate = false) {
  return useLazyAsyncData(
    `transcription-${options.id}`,
    () => new TrackApi().trackIdTranscriptionGet(options),
    { immediate },
  );
}


export function useTranscriptionTool(trackId: number) {
  const { data: transcription } = useTrackTranscription({ id: trackId }, true)
  const { $mediaPlayer } = useNuxtApp()

  // copy transcription
  const editableTranscription = ref<TrackTranslationTranscriptionSegment[] | null>(transcription.value)
  watch(transcription, (_transcription) => {
    if (_transcription?.length) {
      editableTranscription.value = _transcription
    }
  }, { once: true })

  const currentIndex = ref(0)

  function playCurrentTranscriptionItem() {
    const current = transcription.value?.[currentIndex.value]
    if (current && current.start) {
      $mediaPlayer.currentPosition.value = current.start
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
    playCurrentTranscriptionItem,
    goToNextTranscriptionItem,
    goToPreviousTranscriptionItem,
  }
}