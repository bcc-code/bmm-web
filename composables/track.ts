import type {
  TrackGetRequest,
  TrackIdGetRequest,
  TrackModel,
} from "@bcc-code/bmm-sdk-fetch";
import { PublishedFilter, TrackApi } from "@bcc-code/bmm-sdk-fetch";

export function useTracks(options: TrackGetRequest = {}) {
  return reactiveApi(
    useLazyAsyncData<TrackModel[]>(
      "tracks",
      () => new TrackApi().trackGet(options),
      {
        getCachedData(key, nuxtApp) {
          return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
        },
      },
    ),
  );
}

export function useTrack(
  options: TrackIdGetRequest = { id: -1, unpublished: PublishedFilter.Hide },
) {
  return useAsyncData<TrackModel>(
    `track-${options.id}-${options.unpublished}`,
    () => new TrackApi().trackIdGet(options),
    {
      getCachedData(key, nuxtApp) {
        return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
      },
    },
  );
}

export function useTrackIDWithLanguage(
  lang: string,
  options: TrackIdGetRequest,
) {
  return useAsyncData<TrackModel>(
    `track-${options.id}-${lang}`,
    () =>
      new TrackApi().trackIdGet(options, {
        headers: { "Accept-Language": lang },
      }),
    {
      getCachedData(key, nuxtApp) {
        return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
      },
    },
  );
}

export function useTranscribe() {
  return useAsyncData<TrackModel[]>(
    `track-transcribe`,
    () => new TrackApi().trackTranscribeGet(),
    {
      getCachedData(key, nuxtApp) {
        return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
      },
    },
  );
}
