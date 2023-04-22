import { DiscoverApi } from "@bcc-code/bmm-sdk-fetch";

export function useDiscover() {
  return useAsyncData("discover", () => new DiscoverApi().discoverGet());
}
