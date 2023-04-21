import { TrackApi, TrackGetRequest, TrackModel } from "@bcc-code/bmm-sdk-fetch";

export function useTracks(options: TrackGetRequest = {}) {
  return useAsyncData<TrackModel[]>("tracks", () =>
    new TrackApi().trackGet(options)
  );
}
