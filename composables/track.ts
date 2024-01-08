import { TrackApi } from "@bcc-code/bmm-sdk-fetch";
import type { TrackGetRequest } from "@bcc-code/bmm-sdk-fetch";

export function useTracks(options: TrackGetRequest = {}) {
  return reactiveApi(
    useLazyAsyncData("tracks", () => new TrackApi().trackGet(options)),
  );
}
