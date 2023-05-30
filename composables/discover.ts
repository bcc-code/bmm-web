import { DiscoverApi, DiscoverGetRequest } from "@bcc-code/bmm-sdk-fetch";

export function useDiscover(requestParameters: DiscoverGetRequest) {
  return useAsyncData("discover", () =>
    new DiscoverApi().discoverGet(requestParameters)
  );
}
