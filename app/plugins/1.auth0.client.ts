import { createAuth0 } from "@auth0/auth0-vue";

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();

  const auth0 = createAuth0({
    domain: runtimeConfig.public.authUrl,
    clientId: runtimeConfig.public.clientId,
    cacheLocation: "localstorage",
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: "https://bmm-api.brunstad.org",
    },
    useRefreshTokens: true,
  });

  nuxtApp.vueApp.use(auth0);
});
