import { TrackModel, StatisticsApi } from "@bcc-code/bmm-sdk-fetch";
import type { UnwrapRef } from "vue";
import { IUserData } from "plugins/2.userData";
import { AppInsights } from "plugins/3.applicationInsights";
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
  addToQueue: (track: TrackModel) => void;
  addNext: (track: TrackModel) => void;
}

export const authToken = ref<string | undefined>();

export const seekOffset = 15;

export const initMediaPlayer = (
  createMedia: (src: string) => HTMLAudioElement,
  appInsights: AppInsights,
  user: IUserData
): MediaPlayer => {
  const activeMedia = ref<MediaTrack | undefined>();

  const queue = ref(new Queue([]));

  const hasNext = computed(() => queue.value.length > queue.value.index + 1);
  let trackTimestampStart: Date;

  function next() {
    if (!hasNext.value) return;
    queue.value.index += 1;
  }

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

    activeMedia.value = new MediaTrack(
      createMedia(
        authorizedUrl(track.media?.[0]?.files?.[0]?.url || "", authToken.value)
      )
    );
    activeMedia.value.registerEvents();
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
        } else {
          stop();
        }
      }
    }
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
    }
  );

  const hasPrevious = computed(() => queue.value.index > 0);

  function previous() {
    if (!hasPrevious.value) return;
    queue.value.index -= 1;
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

  function addNext(track: TrackModel): void {
    queue.value.splice(queue.value.index + 1, 0, { ...track });
    continuePlayingNextIfEnded();
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
    play: () => {
      if (activeMedia.value) {
        activeMedia.value.play();
      } else {
        initCurrentTrack();
      }
    },
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
    currentPosition: computed({
      get: () => (activeMedia.value ? activeMedia.value.position : NaN),
      set: (value: any) => {
        if (activeMedia.value) {
          activeMedia.value.position = Number(value);
        }
      },
    }),
    currentTrackDuration: computed(() =>
      activeMedia.value ? activeMedia.value.duration : NaN
    ),
    queue: computed(() => queue.value),
    setQueue,
    addToQueue,
    addNext,
  };
};
