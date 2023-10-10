import {
  Auth0Plugin,
  Auth0VueClient,
  AUTH0_INJECTION_KEY,
} from "@auth0/auth0-vue";

export default defineNuxtPlugin((nuxtApp) => {
  const auth0 = {
    getAccessTokenSilently: () => Promise.resolve(""),
    install: () => {},
  };

  auth0.install = () => {
    // eslint-disable-next-line no-param-reassign
    nuxtApp.vueApp.config.globalProperties.$auth0 =
      auth0 as unknown as Auth0VueClient;
    nuxtApp.vueApp.provide(
      AUTH0_INJECTION_KEY,
      auth0 as unknown as Auth0VueClient
    );
  };

  nuxtApp.vueApp.use(auth0 as unknown as Auth0Plugin);
});
