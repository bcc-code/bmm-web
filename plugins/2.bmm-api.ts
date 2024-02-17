import { Configuration, DefaultConfig } from "@bcc-code/bmm-sdk-fetch";

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();

  const { getAccessTokenSilently, isAuthenticated } =
    nuxtApp.vueApp.config.globalProperties.$auth0;

  DefaultConfig.config = new Configuration({
    basePath: runtimeConfig.public.apiUrl,
    middleware: [
      {
        pre: async (ctx) => {
          const token = isAuthenticated.value
            ? await getAccessTokenSilently()
            : null;

          const headers = new Headers(ctx.init.headers);
          if (token) {
            headers.set("Authorization", `Bearer ${token}`);
          }

          const langStore = contentLanguageStore(useNuxtApp().$pinia);
          headers.set(
            "Accept-Language",
            langStore.selectedLanguage || langStore.contentLanguages.join(","),
          );
          const uiLanguage = useNuxtApp().$i18n.locale.value;
          headers.set("UiLanguage", uiLanguage);
          headers.set("BMM-Version", "Web");

          ctx.init.headers = headers;

          return ctx;
        },
      },
    ],
  });
});
