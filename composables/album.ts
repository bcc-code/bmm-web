import { AlbumApi } from "@bcc-code/bmm-sdk-fetch";

interface UseAlbumOptions {
  id: number;
}

export function useAlbum(options: UseAlbumOptions) {
  const { id } = options;

  return reactiveApi(
    useCachedLazyAsyncData(`album-${id}`, () => new AlbumApi().albumIdGet({ id })),
  );
}

export function useAlbums() {
  return reactiveApi(
    useCachedLazyAsyncData("albums", () => new AlbumApi().albumGet()),
  );
}
