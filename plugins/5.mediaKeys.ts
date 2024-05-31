import { defineNuxtPlugin, useNuxtApp } from "#app";
import { MediaPlayerStatus, seekOffset } from "./mediaPlayer/mediaPlayer";

export default defineNuxtPlugin(() => {
  const { $mediaPlayer } = useNuxtApp();

  // Register DOM Media Session, if available
  if ("mediaSession" in navigator) {
    watch(
      $mediaPlayer.currentTrack,
      (track) => {
        if (!track) {
          navigator.mediaSession.metadata = null;
          return;
        }

        const artwork: MediaImage[] = [];

        if (track.cover) {
          artwork.push({
            src: track.cover,
          });
        }

        navigator.mediaSession.metadata = new MediaMetadata({
          title: track.meta?.title || "",
          artist: track.meta?.artist || "",
          album: track.meta?.album || "",
          artwork,
        });
      },
      { immediate: true },
    );
    watch(
      $mediaPlayer.status,
      (state) => {
        switch (state) {
          case MediaPlayerStatus.Paused:
            navigator.mediaSession.playbackState = "paused";
            window.electronAPI.setThumbBarButtons("paused");
            break;
          case MediaPlayerStatus.Playing:
            navigator.mediaSession.playbackState = "playing";
            window.electronAPI.setThumbBarButtons("playing");
            break;
          case MediaPlayerStatus.Stopped:
            navigator.mediaSession.playbackState = "none";
            break;
          default:
            ((_: never) => {})(state);
        }
      },
      { immediate: true },
    );

    navigator.mediaSession.setActionHandler("play", () => {
      $mediaPlayer.play();
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      $mediaPlayer.pause();
    });
    navigator.mediaSession.setActionHandler("stop", () => {
      $mediaPlayer.stop();
    });
    navigator.mediaSession.setActionHandler("seekbackward", (e) => {
      const offset = e.seekOffset ?? seekOffset;
      $mediaPlayer.currentPosition.value -= offset;
    });
    navigator.mediaSession.setActionHandler("seekforward", (e) => {
      const offset = e.seekOffset ?? seekOffset;
      $mediaPlayer.currentPosition.value += offset;
    });
    navigator.mediaSession.setActionHandler("seekto", (e) => {
      if (e.fastSeek !== true) {
        // Option `seekTime` MUST be present for `seekto` action according to documentation (https://developer.mozilla.org/en-US/docs/Web/API/MediaSession/setActionHandler#seektime)
        $mediaPlayer.currentPosition.value = e.seekTime!;
      } else {
        // TODO: What should we do ..? The next seek-operation will follow soon.
      }
    });
    navigator.mediaSession.setActionHandler("previoustrack", () => {
      $mediaPlayer.previous();
    });
    navigator.mediaSession.setActionHandler("nexttrack", () => {
      $mediaPlayer.next();
    });

    // Listen to custom events from the main process

    window.addEventListener("previousTrack", () => {
      $mediaPlayer.previous();
    });

    window.addEventListener("playTrack", () => {
      $mediaPlayer.play();
    });

    window.addEventListener("pauseTrack", () => {
      $mediaPlayer.pause();
    });

    window.addEventListener("nextTrack", () => {
      $mediaPlayer.next();
    });
  }
});
