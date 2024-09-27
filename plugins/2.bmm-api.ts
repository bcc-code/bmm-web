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

          if (!headers.get("Accept-Language")) {
            const langStore = useContentLanguageStore(useNuxtApp().$pinia);
            headers.set(
              "Accept-Language",
              langStore.contentLanguages.join(","),
            );
          }
          const uiLanguage = useNuxtApp().$i18n.locale.value;
          headers.set("UiLanguage", uiLanguage);
          headers.set("BMM-Version", "Web");

          ctx.init.headers = headers;

          return ctx;
        },
        post: async (ctx) => {
          if (
            !ctx.response ||
            ctx.response.status < 200 ||
            ctx.response.status > 300
          ) {
            const responseContent = await ctx.response?.text();
            try {
              const errorObject = JSON.parse(responseContent);
              useNuxtApp().$appInsights.event(
                "request failed by server (json)",
                {
                  url: ctx.url,
                  responseStatus: ctx.response.status,
                  responseContent,
                  errorCode: errorObject.code,
                  errorMessage: errorObject.message,
                  errorList: errorObject.errors,
                },
              );
            } catch (_) {
              useNuxtApp().$appInsights.event(
                "request failed by server (non-json)",
                {
                  url: ctx.url,
                  responseStatus: ctx.response.status,
                  responseContent,
                },
              );
            }
          }
        },
        onError: (ctx) => {
          useNuxtApp().$appInsights.event("request failed by connection", {
            url: ctx.url,
            error: String(ctx.error),
            errorStack:
              ctx.error instanceof Error ? ctx.error.stack : undefined,
            response: ctx.response?.text(),
          });
          return Promise.resolve();
        },
      },
    ],
  });
});
