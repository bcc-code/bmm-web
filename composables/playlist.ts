import { PlaylistApi, PlaylistModel, TrackModel } from "@bcc-code/bmm-sdk-fetch";

interface UsePlaylistOptions {
	id: number
}

/**
 * Get playlist with the specified id
 */
export function usePlaylist(options: UsePlaylistOptions) {
	const { id } = options

	const playlist = useState<PlaylistModel>('playlist', () => ({}))
	const error = ref<any>()
	const pending = ref(true)

	onBeforeMount(() => {
		new PlaylistApi()
			.playlistIdGet({
				id
			})
			.then((data) => {
				playlist.value = data;
			})
			.catch((err) => {
				error.value = err
			})
			.finally(() => {
				pending.value = false
			})
	})

	return {
		playlist,
		error,
		pending
	}
}

interface UsePlaylistTracksOptions {
	id: number
}

/**
 * Get playlist tracks
 */
export function usePlaylistTracks(options: UsePlaylistTracksOptions) {
	const { id } = options

	const tracks = useState<TrackModel[]>('playlist-tracks', () => [])
	const error = ref<any>()
	const pending = ref(true)

	new PlaylistApi()
		.playlistIdTrackGet({
			id
		})
		.then((data) => {
			tracks.value = data;
		})
		.catch((err) => {
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

/**
 * Get all curated playlists
 */
export function usePlaylists() {
	const playlists = useState<PlaylistModel[]>('playlists', () => [])
	const error = ref<any>()
	const pending = ref(true)

	new PlaylistApi()
		.playlistGet()
		.then((data) => {
			playlists.value = data;
		})
		.catch((err) => {
			error.value = err
		})
		.finally(() => {
			pending.value = false
		})

	return {
		playlists,
		error,
		pending
	}
}