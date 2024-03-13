import { useAuth0 } from "@auth0/auth0-vue";
import { initMediaPlayer } from "./mediaPlayer/mediaPlayer";
import type { AppInsights } from "./3.applicationInsights";
import type { IUserData } from "./2.userData";
import MediaTrack from "./mediaPlayer/MediaTrack";

export default defineNuxtPlugin((_) => {
  const { getAccessTokenSilently } = useAuth0();

  const appInsights: AppInsights = useNuxtApp().$appInsights;
  const userData: IUserData = useNuxtApp().$userData;

  return {
    provide: {
      mediaPlayer: initMediaPlayer(
        (src) =>
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
              useNuxtApp().$appInsights.event("[Player] playing media failed", {
                errorCode: e?.code || 0,
                errorMessage: e?.message || "",
              });
            },
          ),
        appInsights,
        userData,
      ),
    },
  };
});
