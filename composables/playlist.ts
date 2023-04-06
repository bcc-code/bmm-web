import { PlaylistApi, PlaylistModel, TrackModel } from "@bcc-code/bmm-sdk-fetch";

interface UsePlaylistOptions {
	id: number
}

/**
 * Get playlist with the specified id
 */
export function usePlaylist(options: UsePlaylistOptions) {
	const { id } = options

	const playlist = ref<PlaylistModel>()
	const error = ref<any>()

	new PlaylistApi()
		.playlistIdGet({
			id
		})
		.then((data) => {
			playlist.value = data;
		})
		.catch((err) => {
			error.value = err
		});

	return {
		playlist,
		error
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

	const tracks = ref<TrackModel[]>()
	const error = ref<any>()

	new PlaylistApi()
		.playlistIdTrackGet({
			id
		})
		.then((data) => {
			tracks.value = data;
		})
		.catch((err) => {
			error.value = err
		});

	return {
		tracks,
		error
	}
}

/**
 * Get all curated playlists
 */
export function usePlaylists() {
	const playlists = ref<PlaylistModel[]>()
	const error = ref<any>()

	new PlaylistApi()
		.playlistGet()
		.then((data) => {
			playlists.value = data;
		})
		.catch((err) => {
			error.value = err
		});

	return {
		playlists,
		error
	}
}