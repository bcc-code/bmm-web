import { PlaylistApi } from "@bcc-code/bmm-sdk-fetch";

interface UseCuratedPlaylistOptions {
  id: number;
}

export function useCuratedPlaylist(options: UseCuratedPlaylistOptions) {
  const { id } = options;

  return reactiveApi(
    useLazyAsyncData(`playlist-${id}`, () =>
      new PlaylistApi().playlistIdDetailsGet({ id }),
    ),
  );
}

interface UseCuratedPlaylistTracksOptions {
  id: number;
}

export function useCuratedPlaylistTracks(
  options: UseCuratedPlaylistTracksOptions,
) {
  const { id } = options;

  return reactiveApi(
    useLazyAsyncData(`playlist-tracks-${id}`, () =>
      new PlaylistApi().playlistIdTrackGet({ id }),
    ),
  );
}

export function useCuratedPlaylists() {
  return reactiveApi(
    useLazyAsyncData("playlists", () => new PlaylistApi().playlistGet()),
  );
}

export function useFeaturedPlaylists() {
  return reactiveApi(
    useLazyAsyncData("playlists-featured", () =>
      new PlaylistApi().playlistDocumentsGet(),
    ),
  );
}
