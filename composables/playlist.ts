import { PlaylistApi } from "@bcc-code/bmm-sdk-fetch";

interface UseCuratedPlaylistOptions {
  id: number;
}

export function useCuratedPlaylist(options: UseCuratedPlaylistOptions) {
  const { id } = options;

  return useLazyAsyncData(`playlist-${id}`, () =>
    new PlaylistApi().playlistIdGet({ id })
  );
}

interface UseCuratedPlaylistTracksOptions {
  id: number;
}

export function useCuratedPlaylistTracks(
  options: UseCuratedPlaylistTracksOptions
) {
  const { id } = options;

  return useLazyAsyncData(`playlist-tracks-${id}`, () =>
    new PlaylistApi().playlistIdTrackGet({ id })
  );
}

export function useCuratedPlaylists() {
  return useLazyAsyncData("playlists", () => new PlaylistApi().playlistGet());
}
