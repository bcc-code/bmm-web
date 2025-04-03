import { AlbumApi } from "@bcc-code/bmm-sdk-fetch";
import type { AlbumModel } from "@bcc-code/bmm-sdk-fetch";

interface UseAlbumOptions {
  id: number;
}

export function useAlbum(options: UseAlbumOptions) {
  const { id } = options;

  return reactiveApi(
    useLazyAsyncData<AlbumModel>(
      `album-${id}`,
      () => new AlbumApi().albumIdGet({ id }),
      {
        getCachedData(key, nuxtApp) {
          return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
        },
      },
    ),
  );
}

export function useAlbums() {
  return reactiveApi(
    useLazyAsyncData<AlbumModel[]>("albums", () => new AlbumApi().albumGet(), {
      getCachedData(key, nuxtApp) {
        return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
      },
    }),
  );
}
