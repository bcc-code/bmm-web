import { AlbumApi } from "@bcc-code/bmm-sdk-fetch";

interface UseAlbumOptions {
  id: number;
}

export function useAlbum(options: UseAlbumOptions) {
  const { id } = options;

  return useLazyAsyncData(`album-${id}`, () =>
    new AlbumApi().albumIdGet({ id })
  );
}

export function useAlbums() {
  return useLazyAsyncData("albums", () => new AlbumApi().albumGet());
}
