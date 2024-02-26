import { TrackApi } from "@bcc-code/bmm-sdk-fetch";
import type {
  TrackGetRequest,
  TrackIdGetRequest,
} from "@bcc-code/bmm-sdk-fetch";

export function useTracks(options: TrackGetRequest = {}) {
  return reactiveApi(
    useLazyAsyncData("tracks", () => new TrackApi().trackGet(options)),
  );
}

export function useTrackIDWithLanguage(
  lang: string,
  options: TrackIdGetRequest,
) {
  return useAsyncData("tracks", () =>
    new TrackApi().trackIdGet(options, {
      headers: { "Accept-Language": lang },
    }),
  );
}
