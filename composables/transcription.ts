import { TrackApi } from "@bcc-code/bmm-sdk-fetch";
import type {
  LanguageEnum,
  TrackIdTranscriptionGetRequest,
  TrackIdTranscriptionLanguageGetRequest,
  TrackTranslationTranscriptionSegment,
} from "@bcc-code/bmm-sdk-fetch";

export function useTrackTranscription(
  options: TrackIdTranscriptionGetRequest,
  immediate = false,
) {
  return useLazyAsyncData(
    `transcription-${options.id}`,
    () => new TrackApi().trackIdTranscriptionGet(options),
    { immediate },
  );
}

type MaybeRefs<T extends Record<any, any>> = { [k in keyof T]: MaybeRef<T[k]> };

export function useTrackTranscriptionWithLanguage(
  options: MaybeRefs<TrackIdTranscriptionLanguageGetRequest>,
) {
  const opts = reactive(options);
  return useLazyAsyncData(`transcription-${opts.id}-${opts.language}`, () =>
    new TrackApi().trackIdTranscriptionLanguageGet(opts),
  );
}

interface UseTranscriptionToolOptions {
  trackId: MaybeRef<number>;
  language: MaybeRef<LanguageEnum>;
}

export function useTranscriptionTool(options: UseTranscriptionToolOptions) {
  const { trackId, language } = toRefs(reactive(options));

  const {
    data: transcription,
    status,
    refresh: refetchTranscription,
  } = useTrackTranscriptionWithLanguage({ id: trackId, language });

  const { $mediaPlayer } = useNuxtApp();

  // copy transcription
  const editableTranscription = useReactiveLocalStorage<
    TrackTranslationTranscriptionSegment[]
  >(
    () => `transcription:${trackId.value}-${language.value}`,
    () => [],
  );
  function copyTranscriptionIfNonExisting() {
    if (!transcription.value?.length) return;
    if (editableTranscription.value.length) return;
    editableTranscription.value = structuredClone(
      toRaw(transcription.value ?? []),
    );
  }
  watch(
    transcription,
    () => {
      copyTranscriptionIfNonExisting();
    },
    { once: true },
  );

  watch(language, async () => {
    await refetchTranscription();
    copyTranscriptionIfNonExisting();
  });

  const currentIndex = ref(0);

  function isWithinCurrentTime(item: TrackTranslationTranscriptionSegment) {
    const hasStarted =
      !!item.start && $mediaPlayer.currentPosition.value >= item.start;
    const hasEnded =
      !!item.end && $mediaPlayer.currentPosition.value > item.end;

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

      const indexOfCurrent =
        transcription.value?.findIndex(isWithinCurrentTime);
      if (!indexOfCurrent || indexOfCurrent === -1) return;
      currentIndex.value = indexOfCurrent;
    },
  );

  const currentTranscriptionSegment = computed(() => {
    if (!transcription.value) return null;
    return (
      transcription.value[currentIndex.value] ||
      transcription.value[currentIndex.value - 1]
    );
  });

  const currentEditableTranscriptionSegment = computed(() => {
    if (!editableTranscription.value) return null;
    return editableTranscription.value[currentIndex.value];
  });

  function playCurrentTranscriptionSegment() {
    if (
      currentTranscriptionSegment.value &&
      currentTranscriptionSegment.value.start
    ) {
      $mediaPlayer.currentPosition.value =
        currentTranscriptionSegment.value.start;
    }
  }

  function goToNextTranscriptionSegment() {
    if (!transcription.value) return;

    currentIndex.value = Math.min(
      currentIndex.value + 1,
      transcription.value.length - 1,
    );

    playCurrentTranscriptionSegment();
  }

  function goToPreviousTranscriptionSegment() {
    currentIndex.value = Math.max(currentIndex.value - 1, 0);
    playCurrentTranscriptionSegment();
  }

  function setTranscriptionSegmentText(
    item: TrackTranslationTranscriptionSegment,
    text: string,
  ) {
    const index = editableTranscription.value.findIndex(
      (_item) => _item.id === item.id,
    );
    if (!editableTranscription.value?.[index]) return;
    editableTranscription.value[index]!.text = text;
  }

  const deletedTranscriptionSegments = ref<
    TrackTranslationTranscriptionSegment[]
  >([]);

  function toggleDeletion(item: TrackTranslationTranscriptionSegment) {
    const index = editableTranscription.value.findIndex(
      (_item) => _item.id === item.id,
    );
    if (!editableTranscription.value[index]) return;
    if (deletedTranscriptionSegments.value.includes(item)) {
      deletedTranscriptionSegments.value.splice(
        deletedTranscriptionSegments.value.indexOf(item),
        1,
      );
      return;
    }
    deletedTranscriptionSegments.value.push(
      editableTranscription.value[index]!,
    );
  }

  return {
    currentIndex,
    transcription,
    status,
    isWithinCurrentTime,
    editableTranscription,
    currentTranscriptionSegment,
    currentEditableTranscriptionSegment,
    playCurrentTranscriptionSegment,
    goToNextTranscriptionSegment,
    goToPreviousTranscriptionSegment,
    setTranscriptionSegmentText,
    toggleDeletion,
    deletedTranscriptionSegments,
    refetchTranscription,
  };
}
