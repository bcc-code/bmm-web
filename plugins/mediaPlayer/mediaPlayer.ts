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
}

export const seekOffset = 15;

export const initMediaPlayer = (
  createMedia: (src: string) => HTMLAudioElement,
  getAccessToken: () => Promise<string>,
  appInsights: AppInsights,
  user: IUserData,
): MediaPlayer => {
  const activeMedia = ref<MediaTrack | undefined>();

  const queue = ref(new Queue([]));

  const hasNext = computed(
    () =>
      queue.value.length > queue.value.index + 1 ||
      (queue.value.isRepeatEnabled && queue.value.length > 1),
  );
  let trackTimestampStart: Date;

  let nextStartPosition = 0;

  function next() {
    if (!hasNext.value) return;
    if (queue.value.length > queue.value.index + 1) queue.value.index += 1;
    else queue.value.index = 0;
  }

  function stop() {
    if (activeMedia.value) {
      activeMedia.value.destroy();
      activeMedia.value = undefined;
    }
  }

  async function initCurrentTrack() {
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
    const token = await getAccessToken();
    activeMedia.value = new MediaTrack(
      createMedia(authorizedUrl(url, token)),
    );
    activeMedia.value.registerEvents();
  }

  function play() {
    if (activeMedia.value) {
      activeMedia.value.play();
    } else {
      initCurrentTrack();
    }
  }

  function restart() {
    if (queue.value.length === 1) play();
    else queue.value.index = 0;
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

        if (hasNext.value) {
          next();
        } else if (queue.value.isRepeatEnabled) {
          restart();
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
    } else if (queue.value.isRepeatEnabled && queue.value.length > 1) {
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
  };
};
