import { PlaylistApi, PlaylistModel } from "@bcc-code/bmm-sdk-fetch";

export default function usePlaylists() {
	const playlists = ref<PlaylistModel[]>()
	const error = ref()

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