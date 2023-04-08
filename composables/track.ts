import { TrackApi, TrackGetRequest, TrackModel } from "@bcc-code/bmm-sdk-fetch";

export function useTracks(options: TrackGetRequest = {}) {
	const tracks = useState<TrackModel[]>('tracks', () => [])
	const error = ref<any>()
	const pending = ref(true)

	new TrackApi()
		.trackGet(options)
		.then(data => {
			tracks.value = data
		})
		.catch(err => {
			error.value = err
		})
		.finally(() => {
			pending.value = false
		})

	return {
		tracks,
		error,
		pending
	}
}