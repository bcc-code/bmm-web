import { AlbumApi, BrowseApi, FacetsApi } from "@bcc-code/bmm-sdk-fetch";

export function useBrowse() {
  return reactiveApi(
    useCachedLazyAsyncData("browse", () => new BrowseApi().browseGet()),
  );
}

export function useBrowseEvents(skip: number = 0) {
  return reactiveApi(
    useCachedLazyAsyncData("browse-events", () =>
      new BrowseApi().browseEventsGet({ skip }),
    ),
  );
}

export function useBrowseAudiobooks() {
  return reactiveApi(
    useCachedLazyAsyncData("browse-audiobooks", () =>
      new BrowseApi().browseAudiobooksGet(),
    ),
  );
}

export function useBrowseMusic() {
  return reactiveApi(
    useCachedLazyAsyncData("browse-music", () => new BrowseApi().browseMusicGet()),
  );
}

export function useBrowsePodcast() {
  return reactiveApi(
    useCachedLazyAsyncData("browse-podcast", () =>
      new BrowseApi().browsePodcastsGet(),
    ),
  );
}

export function useYearList() {
  return reactiveApi(
    useCachedLazyAsyncData("year-list", () =>
      new FacetsApi().controllerAlbumPublishedYearsGet({
        controller: "facets",
      }),
    ),
  );
}

export function useAlbumsInYear(year: number) {
  return reactiveApi(
    useCachedLazyAsyncData(`albums-in-year-${year}`, () =>
      new AlbumApi().albumPublishedYearGet({ year }),
    ),
  );
}
