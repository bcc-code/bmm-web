import { GetTrackCollectionModel, TrackCollectionApi } from "@bcc-code/bmm-sdk-fetch";

interface UseTrackCollectionOptions {
	id: number
}

/**
 * Get specific track collection
 */
export function useTrackCollection(options: UseTrackCollectionOptions) {
	const { id } = options

	const collection = ref<GetTrackCollectionModel>()
	const error = ref<any>()

	new TrackCollectionApi()
		.trackCollectionIdGet({ id })
		.then(data => {
			collection.value = data
		})
		.catch(err => {
			error.value = err
		})

	return {
		collection,
		error
	}
}

/**
 * Get all track collections
 */
export function useTrackCollections() {
	const collections = ref<GetTrackCollectionModel[]>()
	const error = ref<any>()

	new TrackCollectionApi()
		.trackCollectionGet()
		.then(data => {
			collections.value = data
		})
		.catch(err => {
			error.value = err
		})

	return {
		collections,
		error
	}
}