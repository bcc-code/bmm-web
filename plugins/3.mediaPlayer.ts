// eslint-disable-next-line max-classes-per-file
import { TrackModel } from "@bcc-code/bmm-sdk-fetch";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import type { UnwrapRef } from "nuxt/dist/app/compat/capi";

const authToken = ref<string | undefined>();

export enum MediaPlayerStatus {
  Paused = "PAUSED",
  Playing = "PLAYING",
  Stopped = "STOPPED",
}

class Queue extends Array<TrackModel> {
  public isShuffled = false;

  private i = 0;

  get index() {
    return this.i;
  }

  set index(v) {
    if (v >= this.length) {
      this.i = this.length - 1;
    } else if (v < 0) {
      if (this.length === 0) {
        this.i = -1;
      } else {
        this.i = 0;
      }
    } else {
      this.i = v;
    }
    this.currentTrack = this[this.i];
  }

  public currentTrack: TrackModel | undefined;

  private sortedArray: Array<TrackModel> | undefined;

  constructor(data: TrackModel[] = [], index = -1) {
    super();

    if (Array.isArray(data)) {
      data.forEach((el, i) => {
        this[i] = el;
      });
    }

    this.index = index;
  }

  public shuffle() {
    if (this.sortedArray) return;

    const playingTrack = this.currentTrack;
    this.sortedArray = [...this];
    this.sort((a, b) => {
      if (a === this.currentTrack) return -1;
      if (b === this.currentTrack) return 1;
      return Math.random() - 0.5;
    });
    this.isShuffled = true;
    this.i = this.findIndex((v) => v === playingTrack) || 0;
  }

  public unshuffle() {
    if (!this.sortedArray) return;

    const playingTrack = this.currentTrack;
    this.sortedArray.forEach((el, i) => {
      this[i] = el;
    });
    this.sortedArray = undefined;
    this.isShuffled = false;
    this.i = this.findIndex((v) => v === playingTrack) || 0;
  }
}

export class MediaTrack {
  audioElement: HTMLAudioElement;

  public loading = false;

  public paused = false;

  public ended = false;

  private p = 0;

  get position() {
    return this.p;
  }

  set position(v) {
    this.p = v;
    this.audioElement.currentTime = v;
  }

  public duration = 0;

  constructor(audioElement: HTMLAudioElement) {
    this.audioElement = audioElement;
    this.audioElement.autoplay = true;
  }

  registerEvents() {
    this.audioElement.addEventListener("loadedmetadata", () => {
      this.duration = this.audioElement.duration;
    });
    this.audioElement.addEventListener("timeupdate", () => {
      this.p = this.audioElement.currentTime;
    });
    this.audioElement.addEventListener("pause", () => {
      this.paused = true;
    });
    this.audioElement.addEventListener("loadstart", () => {
      this.loading = true;
    });
    this.audioElement.addEventListener("loadeddata", () => {
      this.loading = false;
    });
    this.audioElement.addEventListener("play", () => {
      this.paused = false;
      this.ended = false;
    });
    this.audioElement.addEventListener("ended", () => {
      this.paused = true;
      this.ended = true;
    });
  }

  play() {
    this.audioElement.play();
  }

  pause() {
    this.audioElement.pause();
  }

  destroy() {
    // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Video_and_audio_APIs#stopping_the_video, https://html.spec.whatwg.org/multipage/media.html#best-practices-for-authors-using-media-elements
    this.audioElement.pause();
    this.audioElement.srcObject = null;
  }
}

export interface MediaPlayer {
  // TODO: Do we really need this ..?
  status: ComputedRef<MediaPlayerStatus>;
  play: () => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
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
          // Play next track if there is one
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

export default defineNuxtPlugin((nuxtApp) => {
  const { getAccessTokenSilently, isAuthenticated } =
    nuxtApp.vueApp.config.globalProperties.$auth0;

  watch(
    isAuthenticated,
    async (authenticated) => {
      authToken.value = authenticated
        ? await getAccessTokenSilently()
        : undefined;
    },
    { immediate: true }
  );

  const appInsights: ApplicationInsights = useNuxtApp().$appInsights;

  return {
    provide: {
      mediaPlayer: initMediaPlayer((src) => new Audio(src), appInsights),
    },
  };
});
