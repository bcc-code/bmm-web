import { AUTH0_INJECTION_KEY, Auth0Plugin } from "@auth0/auth0-vue";

export default defineNuxtPlugin(({ vueApp }) => {
  // SSR‌ doesn't really need auth0 for auth. We provide a dummy object instead.
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const auth0Dummy = {
    getAccessTokenSilently: () => Promise.resolve(""),
    install: () => {},
  } as unknown as Auth0Plugin;
  vueApp.config.globalProperties.$auth0 = auth0Dummy;
  vueApp.provide(AUTH0_INJECTION_KEY, auth0Dummy);
  vueApp.use(auth0Dummy);
});
