import { StatisticsApi } from "@bcc-code/bmm-sdk-fetch";
import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";
import type { UnwrapRef } from "vue";
import type { IUserData } from "../2.userData";
import type { AppInsights } from "../3.applicationInsights";
import MediaTrack from "./MediaTrack";
import Queue from "./Queue";

export enum MediaPlayerStatus {
  Paused = "PAUSED",
  Playing = "PLAYING",
  Stopped = "STOPPED",
}

export enum RepeatStatus {
  NoRepeat = 0,
  RepeatQueue = 1,
  RepeatTrack = 2,
}

export interface MediaPlayer {
  status: ComputedRef<MediaPlayerStatus>;
  play: () => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  rewind: () => void;
  fastForward: () => void;
  isLoading: ComputedRef<Boolean>;
  hasNext: ComputedRef<Boolean>;
  hasPrevious: ComputedRef<Boolean>;
  queue: ComputedRef<UnwrapRef<Queue>>;
  currentTrack: ComputedRef<UnwrapRef<TrackModel> | undefined>;
  currentPosition: Ref<number>;
  currentTrackDuration: ComputedRef<number>;
  setQueue: (queue: TrackModel[], index?: number) => void;
  setQueueShuffled: (queue: TrackModel[]) => void;
  addToQueue: (track: TrackModel) => void;
  addNext: (track: TrackModel) => void;
  replaceCurrent: (track: TrackModel) => void;
  repeatStatus: Ref<RepeatStatus>;
}

export const seekOffset = 15;

export const initMediaPlayer = (
  createMediaTrack: (src: string) => MediaTrack,
  appInsights: AppInsights,
  user: IUserData,
): MediaPlayer => {
  const activeMedia = ref<MediaTrack | undefined>();
  const repeatStatus = ref<RepeatStatus>(RepeatStatus.NoRepeat);

  const queue = ref(new Queue([]));

  const hasNext = computed(
    () =>
      queue.value.length > queue.value.index + 1 ||
      (queue.value.length > 0 && repeatStatus.value !== RepeatStatus.NoRepeat),
  );
  let trackTimestampStart: Date;

  let nextStartPosition = 0;

  function stop() {
    if (activeMedia.value) {
      activeMedia.value.destroy();
      activeMedia.value = undefined;
    }
  }

  function initCurrentTrack() {
    const track = queue.value.currentTrack;
    if (!track) {
      stop();
      return;
    }

    activeMedia.value?.destroy();

    let url = track.media?.[0]?.files?.[0]?.url || "";
    if (nextStartPosition > 0) {
      url = `${url}#t=${new Date(nextStartPosition * 1000).toISOString().slice(11, 19)}`;
      nextStartPosition = 0;
    }
    activeMedia.value = createMediaTrack(url);
    activeMedia.value.registerSource();
    activeMedia.value.registerEvents();
  }

  function restartTrack() {
    // TODO: Can we somehow reset the media-track?
    initCurrentTrack();
    // activeMedia.value!.ended = false;
    // activeMedia.value!.position = 0;
    // activeMedia.value!.play()
  }

  function next() {
    if (!hasNext.value) return;

    // When playing the next track in a list where the only track is playing, the index doesn't change; so we have to restart playing the same track manually.
    if (queue.value.length === 1 && queue.value.index === 0) {
      restartTrack();
    } else {
      queue.value.index = (queue.value.index + 1) % queue.value.length;
    }
  }

  function play() {
    if (activeMedia.value) {
      activeMedia.value.play();
    } else {
      initCurrentTrack();
    }
  }

  watch(
    () => activeMedia.value?.ended,
    (ended) => {
      if (ended) {
        const track = queue.value.currentTrack;
        if (track !== undefined && user.personId != null) {
          new StatisticsApi().statisticsListeningPost({
            listeningEvent: [
              {
                personId: user.personId,
                trackId: track.id,
                timestampStart: trackTimestampStart,
                language: track.language ?? "zxx",
                playbackOrigin: null,
                lastPosition: activeMedia.value?.position ?? 0,
                adjustedPlaybackSpeed: 1,
                os: user.os,
              },
            ],
          });

          appInsights.event("track completed", {
            trackId: queue.value.currentTrack?.id,
            duration: activeMedia.value?.position,
          });
        }

        if (repeatStatus.value === RepeatStatus.RepeatTrack) {
          restartTrack();
        } else if (hasNext.value) {
          next();
        } else {
          stop();
        }
      }
    },
  );

  watch(activeMedia, () => {
    if (activeMedia.value) {
      trackTimestampStart = new Date();
      if (appInsights.event) {
        appInsights.event("track playback started", {
          trackId: queue.value.currentTrack?.id,
        });
      }
    }
  });

  watch(
    () => [queue.value.currentTrack, queue.value],
    () => {
      initCurrentTrack();
    },
  );

  const currentPosition = computed({
    get: () => (activeMedia.value ? activeMedia.value.position : NaN),
    set: (value: any) => {
      if (activeMedia.value) {
        activeMedia.value.position = Number(value);
      }
    },
  });

  const hasPrevious = computed(() => queue.value.length > 0);

  const jumpToPreviousThreshold = 5; // BMM Mobile & YouTube Music have 5s. Spotify has 3s.

  function previous() {
    if (currentPosition.value > jumpToPreviousThreshold) {
      currentPosition.value = 0;
    } else if (queue.value.index > 0) {
      queue.value.index -= 1;
    } else if (
      repeatStatus.value === RepeatStatus.RepeatQueue &&
      queue.value.length > 1
    ) {
      queue.value.index = queue.value.length - 1;
    } else {
      currentPosition.value = 0;
    }
  }

  function continuePlayingNextIfEnded() {
    if (!activeMedia.value || activeMedia.value.ended) {
      next();
    }
  }

  function addToQueue(track: TrackModel) {
    queue.value.push({ ...track });
    continuePlayingNextIfEnded();
  }

  function setQueue(_queue: TrackModel[], index = 0): void {
    queue.value = new Queue(_queue, index);
  }

  function setQueueShuffled(newQueue: TrackModel[]): void {
    const trackIndex = Math.floor(Math.random() * newQueue.length);
    setQueue(newQueue, trackIndex);
    queue.value.shuffle();
  }

  function addNext(track: TrackModel): void {
    queue.value.splice(queue.value.index + 1, 0, { ...track });
    continuePlayingNextIfEnded();
  }

  function replaceCurrent(track: TrackModel): void {
    nextStartPosition = activeMedia.value?.position ?? 0;
    stop();

    queue.value = new Queue(
      queue.value.toSpliced(queue.value.index, 1, { ...track }),
      queue.value.index,
    );
  }

  function rewind() {
    if (activeMedia.value) {
      activeMedia.value.position -= seekOffset;
    }
  }

  function fastForward() {
    if (activeMedia.value) {
      activeMedia.value.position += seekOffset;
    }
  }

  return {
    status: computed(() => {
      if (!activeMedia.value) return MediaPlayerStatus.Stopped;
      if (activeMedia.value.paused) return MediaPlayerStatus.Paused;
      return MediaPlayerStatus.Playing;
    }),
    play,
    pause: () => {
      activeMedia.value?.pause();
    },
    stop,
    next,
    previous,
    rewind,
    fastForward,
    isLoading: computed(() => activeMedia.value?.loading || false),
    hasNext,
    hasPrevious,
    currentTrack: computed(() => queue.value.currentTrack),
    currentPosition,
    currentTrackDuration: computed(() =>
      activeMedia.value ? activeMedia.value.duration : NaN,
    ),
    queue: computed(() => queue.value),
    setQueue,
    setQueueShuffled,
    addToQueue,
    addNext,
    replaceCurrent,
    repeatStatus,
  };
};
