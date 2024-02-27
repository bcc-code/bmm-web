import type { AsyncData } from "nuxt/app";

export default function reactiveApi<Data, Error>(data: AsyncData<Data, Error>) {
  const stopHandler = watch(
    [useNuxtApp().$i18n.locale, () => contentLanguageStore().contentLanguages],
    () => {
      data.refresh();
    },
  );

  // Todo: remove once bmm-api correctly calls onError()
  watch(data.error, async () => {
    if (data.error.value) {
      const e = data.error.value as any;
      const errorObject = await e.response.json();
      useNuxtApp().$appInsights.event("request failed", {
        url: e.response.url,
        errorCode: errorObject.code,
        errorMessage: errorObject.message,
        errorList: errorObject.errors,
      });
    }
  });

  return { ...data, stopHandler };
}
