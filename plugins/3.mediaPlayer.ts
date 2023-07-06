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
    if (paused.value) return MediaPlayerStatus.Paused;
    if (ended.value) return MediaPlayerStatus.Stopped;
    return MediaPlayerStatus.Playing;
  });

  const hasNext = computed(
    () => queue.value.length > currentQueueIndex.value + 1
  );

  function next() {
    if (!hasNext.value) return;
    currentQueueIndex.value += 1;
  }

  function setCurrentTrack(track?: TrackModel) {
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
      setCurrentTrack(queue.value[currentQueueIndex.value]);
    }
  );

  const hasPrevious = computed(() => currentQueueIndex.value > 0);

  function previous() {
    if (!hasPrevious.value) return;
    currentQueueIndex.value -= 1;
  }

  function continuePlayingIfEnded() {
    if (ended.value) {
      setCurrentTrack(queue.value[currentQueueIndex.value]);
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
    play: () => activeMedia?.play(),
    pause: () => activeMedia?.pause(),
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
