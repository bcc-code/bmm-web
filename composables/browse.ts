import { AlbumApi, BrowseApi, FacetsApi } from "@bcc-code/bmm-sdk-fetch";
import type {
  AlbumModel,
  AlbumYearFacetsQueryResult,
  DocumentListIAlbumOrChapterHeader,
  DocumentListIAlbumPlaylistOrChapterHeader,
  DocumentListPodcastModel,
  IAlbumPodcastPlaylistOrSectionHeader,
} from "@bcc-code/bmm-sdk-fetch";

export function useBrowse() {
  return reactiveApi(
    useLazyAsyncData<Array<IAlbumPodcastPlaylistOrSectionHeader>>(
      "browse",
      () => new BrowseApi().browseGet(),
      {
        getCachedData(key, nuxtApp) {
          return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
        },
      },
    ),
  );
}

export function useBrowseEvents(skip: number = 0) {
  return reactiveApi(
    useLazyAsyncData<DocumentListIAlbumOrChapterHeader>(
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
    useLazyAsyncData<DocumentListIAlbumPlaylistOrChapterHeader>(
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
    useLazyAsyncData<DocumentListPodcastModel>(
      "browse-music",
      () => new BrowseApi().browseMusicGet(),
      {
        getCachedData(key, nuxtApp) {
          return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
        },
      },
    ),
  );
}

export function useBrowsePodcast() {
  return reactiveApi(
    useLazyAsyncData<DocumentListPodcastModel>(
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
    useLazyAsyncData<AlbumYearFacetsQueryResult[]>(
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
    useLazyAsyncData<AlbumModel[]>(
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
