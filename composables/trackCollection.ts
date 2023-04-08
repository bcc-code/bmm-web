import { GetTrackCollectionModel, TrackCollectionApi } from "@bcc-code/bmm-sdk-fetch";

interface UseTrackCollectionOptions {
	id: number
}

/**
 * Get specific track collection
 */
export function useTrackCollection(options: UseTrackCollectionOptions) {
	const { id } = options

	return useAsyncData<GetTrackCollectionModel>(
		`track-collection-${id}`,
		async () => await new TrackCollectionApi().trackCollectionIdGet({ id })
	)
}

/**
 * Get all track collections
 */
export function useTrackCollections() {
	return useAsyncData<GetTrackCollectionModel[]>(
		'track-collections',
		async () => await new TrackCollectionApi().trackCollectionGet()
	)
}