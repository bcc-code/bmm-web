import { TrackApi, TrackGetRequest, TrackModel } from "@bcc-code/bmm-sdk-fetch";

export function useTracks(options: TrackGetRequest = {}) {
	const tracks = ref<TrackModel[]>()
	const error = ref<any>()

	new TrackApi()
		.trackGet(options)
		.then(data => {
			tracks.value = data
		})
		.catch(err => {
			error.value = err
		})

	return {
		tracks,
		error
	}
}