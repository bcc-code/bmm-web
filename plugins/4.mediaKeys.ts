import { defineNuxtPlugin, useNuxtApp } from "#app";
import { MediaPlayerStatus } from "./3.mediaPlayer";

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
      { immediate: true }
    );
    watch(
      $mediaPlayer.status,
      (state) => {
        switch (state) {
          case MediaPlayerStatus.Paused:
            navigator.mediaSession.playbackState = "paused";
            break;
          case MediaPlayerStatus.Playing:
            navigator.mediaSession.playbackState = "playing";
            break;
          case MediaPlayerStatus.Stopped:
            navigator.mediaSession.playbackState = "none";
            break;
          default:
            ((_: never) => {})(state);
        }
      },
      { immediate: true }
    );

    navigator.mediaSession.setActionHandler("play", () => {
      $mediaPlayer.play();
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      $mediaPlayer.pause();
    });
    navigator.mediaSession.setActionHandler("stop", () => {
      $mediaPlayer.pause();
    });
    navigator.mediaSession.setActionHandler("seekbackward", (_) => {
      console.error("The event `seekbackward` is not implemented yet");
    });
    navigator.mediaSession.setActionHandler("seekforward", (_) => {
      console.error("The event `seekforward` is not implemented yet");
    });
    navigator.mediaSession.setActionHandler("seekto", (_) => {
      console.error("The event `seekto` is not implemented yet");
    });
    navigator.mediaSession.setActionHandler("previoustrack", () => {
      $mediaPlayer.previous();
    });
    navigator.mediaSession.setActionHandler("nexttrack", () => {
      $mediaPlayer.next();
    });
  }
});
