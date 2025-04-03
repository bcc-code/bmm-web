import type {
  TrackGetRequest,
  TrackIdGetRequest,
} from "@bcc-code/bmm-sdk-fetch";
import { PublishedFilter, TrackApi } from "@bcc-code/bmm-sdk-fetch";

export function useTracks(options: TrackGetRequest = {}) {
  return reactiveApi(
    useCachedLazyAsyncData("tracks", () => new TrackApi().trackGet(options)),
  );
}

export function useTrack(
  options: TrackIdGetRequest = { id: -1, unpublished: PublishedFilter.Hide },
) {
  return useAsyncData(`track-${options.id}-${options.unpublished}`, () =>
    new TrackApi().trackIdGet(options),
  );
}

export function useTrackIDWithLanguage(
  lang: string,
  options: TrackIdGetRequest,
) {
  return useAsyncData(`track-${options.id}-${lang}`, () =>
    new TrackApi().trackIdGet(options, {
      headers: { "Accept-Language": lang },
    }),
  );
}

export function useTranscribe() {
  return useAsyncData(`track-transcribe`, () =>
    new TrackApi().trackTranscribeGet(),
  );
}
