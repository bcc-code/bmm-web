import {
  GetTrackCollectionModel,
  TrackCollectionApi,
  TrackCollectionDetails,
} from "@bcc-code/bmm-sdk-fetch";

interface UseTrackCollectionOptions {
  id: number;
}

/**
 * Get specific track collection
 */
export function useTrackCollection(options: UseTrackCollectionOptions) {
  const { id } = options;

  return useLazyAsyncData<GetTrackCollectionModel>(
    `track-collection-${id}`,
    () => new TrackCollectionApi().trackCollectionIdGet({ id })
  );
}

/**
 * Get all track collections
 */
export function useTrackCollections() {
  return useLazyAsyncData<TrackCollectionDetails[]>("track-collections", () =>
    new TrackCollectionApi().trackCollectionGet()
  );
}
