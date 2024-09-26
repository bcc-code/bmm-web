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

export function addTrackToPlaylist(playlistId: number, trackId: number) {
  return new TrackCollectionApi().trackCollectionIdPost({
    id: playlistId,
    link: [`</track/${trackId}>,`],
  });
}

export function addAlbumToPlaylist(playlistId: number, albumId: number) {
  return new TrackCollectionApi().trackCollectionIdAlbumAlbumIdPost({
    id: playlistId,
    albumId,
  });
}

export function addCuratedPlaylistToPlaylist(
  playlistId: number,
  idToAdd: number,
) {
  return new TrackCollectionApi().trackCollectionIdPlaylistPlaylistIdPost({
    id: playlistId,
    playlistId: idToAdd,
  });
}

export function addPrivatePlaylistToPlaylist(
  playlistId: number,
  idToAdd: number,
) {
  return new TrackCollectionApi().trackCollectionIdTrackCollectionPlaylistIdPost(
    {
      id: playlistId,
      playlistId: idToAdd,
    },
  );
}
