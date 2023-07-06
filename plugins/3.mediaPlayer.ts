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
}

export interface MediaPlaylist {
  queue: Ref<TrackModel[]>;
  currentTrack: ComputedRef<TrackModel | undefined>;
  setCurrentTrack: (src: TrackModel) => void;
  clearCurrentTrack: () => void;
  addTrackToQueue: (track: TrackModel) => void;
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
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    setCurrentTrack(queue.value[currentQueueIndex.value + 1]);
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

    // Update queue index if track is in queue
    // else clear queue and index
    const index = queue.value.findIndex((t) => t.id === track.id);
    if (index !== -1) {
      currentQueueIndex.value = index;
    } else {
      queue.value = [];
      currentQueueIndex.value = 0;
    }

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

  const hasPrevious = computed(() => currentQueueIndex.value > 0);

  function previous() {
    if (!hasPrevious.value) return;
    setCurrentTrack(queue.value[currentQueueIndex.value - 1]);
  }

  function clearCurrentTrack() {
    activeMedia?.pause();
    activeMedia = undefined;
    currentTrack.value = undefined;
    paused.value = true;
    ended.value = false;
  }

  function addTrackToQueue(track: TrackModel) {
    // Add track if not already in queue
    // else move track to end of queue only if it is before the current track
    const index = queue.value.findIndex((t) => t.id === track.id);
    if (index === -1) {
      queue.value.push(track);
    } else if (index < currentQueueIndex.value) {
      queue.value.splice(index, 1);
      queue.value.push(track);
    }

    // Play if currently paused and no track is playing
    if (!loading.value && (paused.value || ended.value)) {
      setCurrentTrack(track);
    }

    return track;
  }

  const mediaPlayer: MediaPlayer = {
    status: playerStatus,
    play: () => activeMedia?.play(),
    pause: () => activeMedia?.pause(),
    next,
    previous,
    hasNext,
    hasPrevious,
  };

  const mediaPlaylist: MediaPlaylist = {
    currentTrack: computed(() => currentTrack.value),
    queue,
    setCurrentTrack,
    clearCurrentTrack,
    addTrackToQueue,
  };

  return {
    provide: {
      mediaPlayer,
      mediaPlaylist,
    },
  };
});
