import { PlaylistApi } from "@bcc-code/bmm-sdk-fetch";

interface UsePlaylistOptions {
  id: number;
}

/**
 * Get playlist with the specified id
 */
export function usePlaylist(options: UsePlaylistOptions) {
  const { id } = options;

  return useLazyAsyncData(`playlist-${id}`, () =>
    new PlaylistApi().playlistIdGet({ id })
  );
}

interface UsePlaylistTracksOptions {
  id: number;
}

/**
 * Get playlist tracks
 */
export function usePlaylistTracks(options: UsePlaylistTracksOptions) {
  const { id } = options;

  return useLazyAsyncData(`playlist-tracks-${id}`, () =>
    new PlaylistApi().playlistIdTrackGet({ id })
  );
}

/**
 * Get all curated playlists
 */
export function usePlaylists() {
  return useLazyAsyncData("playlists", () => new PlaylistApi().playlistGet());
}
