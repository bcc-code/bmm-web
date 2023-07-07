import { TrackModel } from "@bcc-code/bmm-sdk-fetch";

const authToken: Ref<string | undefined> = ref();

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
  hasNext: ComputedRef<Boolean>;
  hasPrevious: ComputedRef<Boolean>;
  queue: Ref<TrackModel[]>;
  currentTrack: ComputedRef<TrackModel | undefined>;
  setQueue: (queue: TrackModel[], index?: number) => void;
  addToQueue: (track: TrackModel) => void;
  playNext: (track: TrackModel) => void;
}

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

  // Good to know when writing tests: https://github.com/jsdom/jsdom/issues/2155#issuecomment-366703395
  let activeMedia: HTMLAudioElement | undefined;

  const loading = ref(false);
  const paused = ref(true);
  const ended = ref(false);
  const currentTrack: Ref<TrackModel | undefined> = ref(undefined);

  const queue: Ref<TrackModel[]> = ref([]);
  const currentQueueIndex: Ref<number> = ref(0);

  const playerStatus = computed(() => {
    if (ended.value) return MediaPlayerStatus.Stopped;
    if (paused.value) return MediaPlayerStatus.Paused;
    return MediaPlayerStatus.Playing;
  });

  const hasNext = computed(
    () => queue.value.length > currentQueueIndex.value + 1
  );

  function next() {
    if (!hasNext.value) return;
    currentQueueIndex.value += 1;
  }

  function initCurrentTrack() {
    const track = queue.value[currentQueueIndex.value];
    if (!track) return;

    activeMedia?.pause();

    activeMedia = new Audio(
      authorizedUrl(track.media?.[0]?.files?.[0]?.url || "", authToken.value)
    );
    activeMedia.autoplay = true;
    loading.value = true;
    currentTrack.value = track;
    paused.value = true;
    ended.value = false;
    useNuxtApp().$appInsights.trackEvent({
      name: "track playback started",
      properties: {
        trackId: track.id,
      },
    });

    activeMedia.addEventListener("pause", () => {
      paused.value = true;
    });
    activeMedia.addEventListener("loadstart", () => {
      if (activeMedia?.autoplay) {
        paused.value = false;
        ended.value = false;
      }
      loading.value = false;
    });
    activeMedia.addEventListener("play", () => {
      paused.value = false;
      ended.value = false;
    });
    activeMedia.addEventListener("playing", () => {
      paused.value = false;
    });
    activeMedia.addEventListener("ended", () => {
      paused.value = true;
      ended.value = true;
      useNuxtApp().$appInsights.trackEvent({
        name: "track completed",
        properties: {
          trackId: track.id,
        },
      });
      // Play next track if there is one
      next();
    });
  }

  watch(
    () => [currentQueueIndex.value, queue.value],
    () => {
      initCurrentTrack();
    }
  );

  const hasPrevious = computed(() => currentQueueIndex.value > 0);

  function previous() {
    if (!hasPrevious.value) return;
    currentQueueIndex.value -= 1;
  }

  function continuePlayingIfEnded() {
    if (ended.value) {
      initCurrentTrack();
    }
  }

  function addToQueue(track: TrackModel) {
    queue.value.push(track);
    continuePlayingIfEnded();
  }

  function setQueue(_queue: TrackModel[], index = 0): void {
    queue.value = [..._queue];
    currentQueueIndex.value = index;
  }

  function playNext(track: TrackModel): void {
    queue.value.splice(currentQueueIndex.value + 1, 0, track);
    continuePlayingIfEnded();
  }

  const mediaPlayer: MediaPlayer = {
    status: playerStatus,
    play: () => {
      if (activeMedia) {
        activeMedia.play();
      } else {
        initCurrentTrack();
      }
    },
    pause: () => {
      activeMedia?.pause();
    },
    stop: () => {
      // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Video_and_audio_APIs#stopping_the_video, https://html.spec.whatwg.org/multipage/media.html#best-practices-for-authors-using-media-elements
      if (activeMedia) {
        activeMedia.pause();
        activeMedia.srcObject = null;
        activeMedia = undefined;
        ended.value = true;
      }
    },
    next,
    previous,
    hasNext,
    hasPrevious,
    currentTrack: computed(() => currentTrack.value),
    queue,
    setQueue,
    addToQueue,
    playNext,
  };

  return {
    provide: {
      mediaPlayer,
    },
  };
});
