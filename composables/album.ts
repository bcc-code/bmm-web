import { AlbumApi, AlbumModel } from "@bcc-code/bmm-sdk-fetch";

interface UseAlbumOptions {
  id: number;
}

/**
 * Get playlist with the specified id
 */
export function useAlbum(options: UseAlbumOptions) {
  const { id } = options;

  return useAsyncData<AlbumModel>(`album-${id}`, () =>
    new AlbumApi().albumIdGet({ id })
  );
}

/**
 * Get all albums
 */
export function useAlbums() {
  return useAsyncData<AlbumModel[]>("albums", () => new AlbumApi().albumGet());
}
