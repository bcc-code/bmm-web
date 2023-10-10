import { AsyncData } from "#app";

export default function reactiveApi<Data, Error>(data: AsyncData<Data, Error>) {
  const stopHandler = watch(
    () => contentLanguageStore().contentLanguages,
    () => {
      data.refresh();
    }
  );

  return { ...data, stopHandler };
}
