import type { AsyncData } from "nuxt/app";

export function reactiveDependencies() {
  return [
    useNuxtApp().$i18n.locale,
    () => useContentLanguageStore().contentLanguages,
  ];
}

export default function reactiveApi<Data, Error>(data: AsyncData<Data, Error>) {
  const stopHandler = watch(reactiveDependencies(), () => {
    data.refresh();
  });

  return { ...data, stopHandler };
}
