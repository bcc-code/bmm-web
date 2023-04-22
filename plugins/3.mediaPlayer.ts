import { TrackModel } from "@bcc-code/bmm-sdk-fetch";
import { computed, ComputedRef, InjectionKey, Ref, ref, watch } from "vue";

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
}

export interface MediaPlaylist {
  currentTrack: ComputedRef<TrackModel | undefined>;
  setCurrentTrack: (src: TrackModel) => void;
  clearCurrentTrack: (src: string) => void;
}

export const MediaPlayerInjectionKey: InjectionKey<MediaPlayer> = Symbol(
  "Vue InjectionKey MediaPlayer"
);

export const MediaPlaylistInjectionKey: InjectionKey<MediaPlaylist> = Symbol(
  "Vue InjectionKey MediaPlaylist"
);

export default defineNuxtPlugin((nuxtApp) => {
  const { getAccessTokenSilently, isAuthenticated } =
    nuxtApp.vueApp.config.globalProperties.$auth0;

  watch(
    isAuthenticated,
    async () => {
      authToken.value = await getAccessTokenSilently();
    },
    { immediate: true }
  );

  // Good to know when writing tests: https://github.com/jsdom/jsdom/issues/2155#issuecomment-366703395
  let activeMedia: HTMLAudioElement | undefined;

  const paused = ref(true);
  const ended = ref(false);
  const currentTrack: Ref<TrackModel | undefined> = ref(undefined);

  const playerStatus = computed(() => {
    if (paused.value) return MediaPlayerStatus.Paused;
    if (ended.value) return MediaPlayerStatus.Stopped;
    return MediaPlayerStatus.Playing;
  });

  nuxtApp.vueApp.provide(MediaPlayerInjectionKey, {
    status: playerStatus,
    play: () => activeMedia?.play(),
    pause: () => activeMedia?.pause(),
  });

  nuxtApp.vueApp.provide(MediaPlaylistInjectionKey, {
    currentTrack: computed(() => currentTrack.value),
    clearCurrentTrack() {
      activeMedia?.pause();
      activeMedia = undefined;
      currentTrack.value = undefined;
      paused.value = true;
      ended.value = false;
    },
    setCurrentTrack(track) {
      activeMedia?.pause();

      activeMedia = new Audio(
        authorizedUrl(track.media?.[0]?.files?.[0]?.url || "", authToken.value)
      );
      activeMedia.autoplay = true;
      currentTrack.value = track;
      paused.value = true;
      ended.value = false;

      activeMedia.addEventListener("pause", () => {
        paused.value = true;
      });
      activeMedia.addEventListener("loadstart", () => {
        if (activeMedia?.autoplay) {
          paused.value = false;
          ended.value = false;
        }
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
      });
    },
  });
});
