import { SearchApi } from "@bcc-code/bmm-sdk-fetch";

interface UseSearchOptions {
  term: string;
}

export function useSearch(options: UseSearchOptions) {
  const { term } = options;
  return reactiveApi(
    useLazyAsyncData(`search-${term}`, () =>
      new SearchApi().searchV2TermGet({ term })
    )
  );
}
