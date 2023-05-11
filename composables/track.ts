import { TrackApi, TrackGetRequest, TrackModel } from "@bcc-code/bmm-sdk-fetch";

export function useTracks(options: TrackGetRequest = {}) {
  return useLazyAsyncData<TrackModel[]>("tracks", () =>
    new TrackApi().trackGet(options)
  );
}
