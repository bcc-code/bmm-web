import { useAuth0 } from "@auth0/auth0-vue";
import { initMediaPlayer } from "./mediaPlayer/mediaPlayer";
import type { AppInsights } from "./3.applicationInsights";
import type { IUserData } from "./2.userData";

export default defineNuxtPlugin((_) => {
  const { getAccessTokenSilently } = useAuth0();

  const appInsights: AppInsights = useNuxtApp().$appInsights;
  const userData: IUserData = useNuxtApp().$userData;

  return {
    provide: {
      mediaPlayer: initMediaPlayer(
        (src) => new Audio(src),
        getAccessTokenSilently,
        appInsights,
        userData,
      ),
    },
  };
});
