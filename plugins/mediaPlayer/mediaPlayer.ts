import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { TrackModel } from "@bcc-code/bmm-sdk-fetch";
import type { UnwrapRef } from "nuxt/dist/app/compat/capi";
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
  isLoading: ComputedRef<Boolean>;
  hasNext: ComputedRef<Boolean>;
  hasPrevious: ComputedRef<Boolean>;
  queue: Ref<UnwrapRef<Queue>>;
  currentTrack: ComputedRef<TrackModel | undefined>;
  currentPosition: Ref<number>;
  currentTrackDuration: Ref<number>;
  setQueue: (queue: TrackModel[], index?: number) => void;
  addToQueue: (track: TrackModel) => void;
  playNext: (track: TrackModel) => void;
}

export const authToken = ref<string | undefined>();

export const initMediaPlayer = (
  createMedia: (src: string) => HTMLAudioElement,
  appInsights: ApplicationInsights
): MediaPlayer => {
  const activeMedia = ref<MediaTrack | undefined>();

  const queue = ref(new Queue([]));

  const playerStatus = computed(() => {
    if (!activeMedia.value || activeMedia.value.ended)
      return MediaPlayerStatus.Stopped;
    if (activeMedia.value.paused) return MediaPlayerStatus.Paused;
    return MediaPlayerStatus.Playing;
  });

  const hasNext = computed(() => queue.value.length > queue.value.index + 1);

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

    activeMedia.value?.pause();

    activeMedia.value = new MediaTrack(
      createMedia(
        authorizedUrl(track.media?.[0]?.files?.[0]?.url || "", authToken.value)
      )
    );
    // Events must be registerd after marking the object as reactive, otherwise `this` is not the proxy created for reactivity where events are registered.
    activeMedia.value.registerEvents();
  }

  watch(
    () => activeMedia.value?.ended,
    (ended) => {
      if (ended) {
        appInsights.trackEvent({
          name: "track completed",
          properties: {
            trackId: queue.value.currentTrack?.id,
          },
        });

        if (hasNext.value) {
          next();
        }
      }
    }
  );

  watch(activeMedia, () => {
    if (activeMedia.value) {
      appInsights.trackEvent({
        name: "track playback started",
        properties: {
          trackId: queue.value.currentTrack?.id,
        },
      });
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
    const i = _queue.length > 0 ? index : -1;
    queue.value = new Queue(_queue, i);
  }

  function playNext(track: TrackModel): void {
    queue.value.splice(queue.value.index + 1, 0, { ...track });
    continuePlayingNextIfEnded();
  }

  return {
    status: playerStatus,
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
    isLoading: computed(() => activeMedia.value?.loading || false),
    hasNext,
    hasPrevious,
    currentTrack: computed(() => queue.value.currentTrack),
    currentPosition: computed({
      get: () => activeMedia.value?.position || 0,
      set: (value) => {
        if (activeMedia.value) {
          activeMedia.value.position = value;
        }
      },
    }),
    currentTrackDuration: computed(() => activeMedia.value?.duration || 0),
    queue,
    setQueue,
    addToQueue,
    playNext,
  };
};
