import { DiscoverApi } from "@bcc-code/bmm-sdk-fetch";
import type { DiscoverGetRequest } from "@bcc-code/bmm-sdk-fetch";

export function useDiscover(requestParameters: DiscoverGetRequest) {
  return reactiveApi(
    useLazyAsyncData("discover", () =>
      new DiscoverApi().discoverGet(requestParameters),
    ),
  );
}
