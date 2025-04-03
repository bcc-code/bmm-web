import { SharedPlaylistApi, TrackCollectionApi } from "@bcc-code/bmm-sdk-fetch";
import type { TrackCollectionDetails } from "@bcc-code/bmm-sdk-fetch";
import type { AsyncData } from "nuxt/app";

interface UseTrackCollectionOptions {
  id: number;
}

let playlistsRequest: AsyncData<TrackCollectionDetails[], Error | null> | null =
  null;

export function usePrivatePlaylist(options: UseTrackCollectionOptions) {
  const { id } = options;

  return reactiveApi(
    useLazyAsyncData(
      `track-collection-${id}`,
      () => new TrackCollectionApi().trackCollectionIdGet({ id }),
      {
        getCachedData(key, nuxtApp) {
          return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
        },
      },
    ),
  );
}

export function usePrivatePlaylists() {
  if (playlistsRequest != null) return playlistsRequest;

  playlistsRequest = reactiveApi(
    useLazyAsyncData(
      "track-collections",
      () => new TrackCollectionApi().trackCollectionGet(),
      {
        getCachedData(key, nuxtApp) {
          return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
        },
      },
    ),
  );
  return playlistsRequest;
}

export function refreshPrivatePlaylists() {
  if (playlistsRequest != null) playlistsRequest.refresh();
}

export function addPrivatePlaylist(name: string) {
  return new TrackCollectionApi().trackCollectionPost({
    createTrackCollectionCommand: { name },
  });
}

export function useSharedPrivatePlaylist(sharingSecret: string) {
  return reactiveApi(
    useLazyAsyncData(
      `track-collection-shared-${sharingSecret}`,
      () =>
        new SharedPlaylistApi().sharedPlaylistSharingSecretGet({
          sharingSecret,
        }),
      {
        getCachedData(key, nuxtApp) {
          return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
        },
      },
    ),
  );
}
