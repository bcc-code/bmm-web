import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { authToken, initMediaPlayer } from "./mediaPlayer/mediaPlayer";
import { AppInsights } from "./2.applicationInsights";

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

  const appInsights: AppInsights = useNuxtApp().$appInsights;

  return {
    provide: {
      mediaPlayer: initMediaPlayer((src) => new Audio(src), appInsights),
    },
  };
});
