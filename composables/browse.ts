import { AlbumApi, BrowseApi, FacetsApi } from "@bcc-code/bmm-sdk-fetch";

export function useBrowse() {
  return reactiveApi(
    useLazyAsyncData("browse", () => new BrowseApi().browseGet()),
  );
}

export function useBrowseEvents(skip: number = 0) {
  return reactiveApi(
    useLazyAsyncData(
      "browse-events",
      () => new BrowseApi().browseEventsGet({ skip }),
      {
        getCachedData(key, nuxtApp) {
          return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
        },
      },
    ),
  );
}

export function useBrowseAudiobooks() {
  return reactiveApi(
    useLazyAsyncData(
      "browse-audiobooks",
      () => new BrowseApi().browseAudiobooksGet(),
      {
        getCachedData(key, nuxtApp) {
          return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
        },
      },
    ),
  );
}

export function useBrowseMusic() {
  return reactiveApi(
    useLazyAsyncData("browse-music", () => new BrowseApi().browseMusicGet(), {
      getCachedData(key, nuxtApp) {
        return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
      },
    }),
  );
}

export function useBrowsePodcast() {
  return reactiveApi(
    useLazyAsyncData(
      "browse-podcast",
      () => new BrowseApi().browsePodcastsGet(),
      {
        getCachedData(key, nuxtApp) {
          return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
        },
      },
    ),
  );
}

export function useYearList() {
  return reactiveApi(
    useLazyAsyncData(
      "year-list",
      () =>
        new FacetsApi().controllerAlbumPublishedYearsGet({
          controller: "facets",
        }),
      {
        getCachedData(key, nuxtApp) {
          return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
        },
      },
    ),
  );
}

export function useAlbumsInYear(year: number) {
  return reactiveApi(
    useLazyAsyncData(
      `albums-in-year-${year}`,
      () => new AlbumApi().albumPublishedYearGet({ year }),
      {
        getCachedData(key, nuxtApp) {
          return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
        },
      },
    ),
  );
}
