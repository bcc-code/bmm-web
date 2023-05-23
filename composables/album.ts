import { AlbumApi } from "@bcc-code/bmm-sdk-fetch";

interface UseAlbumOptions {
  id: number;
}

/**
 * Get playlist with the specified id
 */
export function useAlbum(options: UseAlbumOptions) {
  const { id } = options;

  return useLazyAsyncData(`album-${id}`, () =>
    new AlbumApi().albumIdGet({ id })
  );
}

/**
 * Get all albums
 */
export function useAlbums() {
  return useLazyAsyncData("albums", () => new AlbumApi().albumGet());
}
