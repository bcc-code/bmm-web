import { PlaylistApi } from "@bcc-code/bmm-sdk-fetch";

interface UseCuratedPlaylistOptions {
  id: number;
}

export function useCuratedPlaylist(options: UseCuratedPlaylistOptions) {
  const { id } = options;

  return reactiveApi(
    useCachedLazyAsyncData(`playlist-${id}`, () =>
      new PlaylistApi().playlistIdGet({ id }),
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
    useCachedLazyAsyncData(`playlist-tracks-${id}`, () =>
      new PlaylistApi().playlistIdTrackGet({ id }),
    ),
  );
}

export function useCuratedPlaylists() {
  return reactiveApi(
    useCachedLazyAsyncData("playlists", () => new PlaylistApi().playlistGet()),
  );
}

export function useFeaturedPlaylists() {
  return reactiveApi(
    useCachedLazyAsyncData("playlists-featured", () =>
      new PlaylistApi().playlistDocumentsGet(),
    ),
  );
}
