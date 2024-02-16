import { PlaylistApi, TrackCollectionApi } from "@bcc-code/bmm-sdk-fetch";

interface UseCuratedPlaylistOptions {
  id: number;
}

export function useCuratedPlaylist(options: UseCuratedPlaylistOptions) {
  const { id } = options;

  return reactiveApi(
    useLazyAsyncData(`playlist-${id}`, () =>
      new PlaylistApi().playlistIdGet({ id }),
    ),
  );
}

interface UseCuratedPlaylistTracksOptions {
  id: number;
  locale?: string;
}

export function useCuratedPlaylistTracks(
  options: UseCuratedPlaylistTracksOptions,
) {
  const { id, locale } = options;

  return reactiveApi(
    useLazyAsyncData(`playlist-tracks-${id}`, () =>
      new PlaylistApi().playlistIdTrackGet({ id }, 
        locale ? { headers: { 'Accept-Language': locale } } : undefined),
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

export function addTrackToPlaylist(playlistId: number, trackId: number) {
  return new TrackCollectionApi().trackCollectionIdPost({
    id: playlistId,
    link: [`</track/${trackId}>,`],
  });
}
