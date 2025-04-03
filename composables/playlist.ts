import { PlaylistApi } from "@bcc-code/bmm-sdk-fetch";

interface UseCuratedPlaylistOptions {
  id: number;
}

export function useCuratedPlaylist(options: UseCuratedPlaylistOptions) {
  const { id } = options;

  return reactiveApi(
    useLazyAsyncData(
      `playlist-${id}`,
      () => new PlaylistApi().playlistIdGet({ id }),
      {
        getCachedData(key, nuxtApp) {
          return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
        },
      },
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
    useLazyAsyncData(
      `playlist-tracks-${id}`,
      () => new PlaylistApi().playlistIdTrackGet({ id }),
      {
        getCachedData(key, nuxtApp) {
          return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
        },
      },
    ),
  );
}

export function useCuratedPlaylists() {
  return reactiveApi(
    useLazyAsyncData("playlists", () => new PlaylistApi().playlistGet(), {
      getCachedData(key, nuxtApp) {
        return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
      },
    }),
  );
}

export function useFeaturedPlaylists() {
  return reactiveApi(
    useLazyAsyncData(
      "playlists-featured",
      () => new PlaylistApi().playlistDocumentsGet(),
      {
        getCachedData(key, nuxtApp) {
          return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
        },
      },
    ),
  );
}
