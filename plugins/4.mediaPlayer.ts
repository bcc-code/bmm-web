import { useAuth0 } from "@auth0/auth0-vue";
import { ResourceAvailability, StatisticsApi } from "@bcc-code/bmm-sdk-fetch";
import type { StatisticsTrackPlayedPostRequest } from "@bcc-code/bmm-sdk-fetch";
import { initMediaPlayer } from "./mediaPlayer/mediaPlayer";
import type { AppInsights } from "./3.applicationInsights";
import type { IUserData } from "./2.userData";
import MediaTrack from "./mediaPlayer/MediaTrack";
import type { PlayMeasurement } from "./mediaPlayer/MediaTrack";

export default defineNuxtPlugin((_) => {
  const { getAccessTokenSilently } = useAuth0();

  const appInsights: AppInsights = useNuxtApp().$appInsights;
  const userData: IUserData = useNuxtApp().$userData;
  const runtimeConfig = useRuntimeConfig();

  return {
    provide: {
      mediaPlayer: initMediaPlayer(
        (src, track) =>
          new MediaTrack(
            () =>
              getAccessTokenSilently()
                .then((t) => authorizedUrl(src, t))
                .catch((e) => {
                  useNuxtApp().$appInsights.event(
                    "[Player] refreshing access token failed",
                    {
                      error: String(e),
                    },
                  );
                  throw e;
                }),
            (e) => {
              if (e instanceof MediaError) {
                useNuxtApp().$appInsights.event(
                  "[Player] playing media failed",
                  {
                    errorType: "MediaError",
                    errorCode: e.code,
                    errorMessage: e.message,
                    url: src,
                  },
                );
              } else if (e instanceof Error) {
                if (e instanceof DOMException && e.name === "NotAllowedError") {
                  // Ignore. This is an error the user has to resolve. See: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play#exceptions
                  return;
                }

                useNuxtApp().$appInsights.event(
                  "[Player] playing media failed",
                  {
                    errorType: e.constructor.name,
                    errorName: e.name,
                    errorMessage: e.message,
                    url: src,
                  },
                );
              } else {
                useNuxtApp().$appInsights.event(
                  "[Player] playing media failed",
                  {
                    errorType: e?.constructor.name || "",
                    error: String(e),
                    url: src,
                  },
                );
              }
            },
            (play: PlayMeasurement) => {
              const file = defaultFileForTrack(track);
              const trackLength = file?.duration || 0;
              const eventValues = {
                ...play,
                personId: userData.personId,
                trackId: track.id,
                percentage:
                  trackLength > 0
                    ? (play.uniqueSecondsListened * 100) / trackLength
                    : 0,
                trackLength,
                typeOfTrack: track.subtype,
                availability: ResourceAvailability.Remote,
                albumId: track.parentId,
                tags: track.tags,
                sentAfterStartup: false,
                language: track.language,
                playbackOrigin: "",
                adjustedPlaybackSpeed: 1,
                client: runtimeConfig.public.systemName,
              };

              useNuxtApp().$appInsights.event("track played", eventValues);
              new StatisticsApi()
                .statisticsTrackPlayedPost({
                  createTrackPlayedEventsCommandEvent: [eventValues],
                })
                .catch((e) => {
                  useNuxtApp().$appInsights.event(
                    "sending TrackPlayed failed",
                    { error: String(e), eventValues },
                  );
                });
            },
            appInsights,
          ),
        appInsights,
        userData,
      ),
    },
  };
});
