import { SearchApi, SearchFilter } from "@bcc-code/bmm-sdk-fetch";

interface UseSearchOptions {
  term: string;
  filter?: SearchFilter;
}

export function useSearch(options: UseSearchOptions) {
  const { term, filter } = options;
  return reactiveApi(
    useCachedLazyAsyncData(`search-${term}-${filter}`, () =>
      new SearchApi().searchV2TermGet(options),
    ),
  );
}
