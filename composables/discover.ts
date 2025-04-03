import { DiscoverApi } from "@bcc-code/bmm-sdk-fetch";
import type {
  DiscoverGetRequest,
  IAllDocumentModels,
} from "@bcc-code/bmm-sdk-fetch";

export function useDiscover(requestParameters: DiscoverGetRequest) {
  return reactiveApi(
    useLazyAsyncData<IAllDocumentModels[]>(
      "discover",
      () => new DiscoverApi().discoverGet(requestParameters),
      {
        getCachedData(key, nuxtApp) {
          return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
        },
      },
    ),
  );
}
