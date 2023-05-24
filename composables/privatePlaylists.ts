import { TrackCollectionApi } from "@bcc-code/bmm-sdk-fetch";

interface UseTrackCollectionOptions {
  id: number;
}

export function usePrivatePlaylist(options: UseTrackCollectionOptions) {
  const { id } = options;

  return useLazyAsyncData(`track-collection-${id}`, () =>
    new TrackCollectionApi().trackCollectionIdGet({ id })
  );
}

export function usePrivatePlaylists() {
  return useLazyAsyncData("track-collections", () =>
    new TrackCollectionApi().trackCollectionGet()
  );
}
