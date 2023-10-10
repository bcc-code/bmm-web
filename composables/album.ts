import { AlbumApi } from "@bcc-code/bmm-sdk-fetch";

interface UseAlbumOptions {
  id: number;
}

export function useAlbum(options: UseAlbumOptions) {
  const { id } = options;

  return reactiveApi(
    useLazyAsyncData(`album-${id}`, () => new AlbumApi().albumIdGet({ id }))
  );
}

export function useAlbums() {
  return reactiveApi(
    useLazyAsyncData("albums", () => new AlbumApi().albumGet())
  );
}
