import { ContributorApi } from "@bcc-code/bmm-sdk-fetch";
import type { ContributorModel, TrackModel } from "@bcc-code/bmm-sdk-fetch";

interface UseContributorOptions {
  id: number;
}

export function useContributor(options: UseContributorOptions) {
  const { id } = options;

  return useLazyAsyncData<ContributorModel>(
    `contributor-${id}`,
    () => new ContributorApi().contributorIdGet({ id }),
    {
      getCachedData(key, nuxtApp) {
        return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
      },
    },
  );
}

export function useContributorShuffle(id: number) {
  return useAsyncData<TrackModel[]>(
    `contributor-${id}-shuffle`,
    () => new ContributorApi().contributorIdRandomGet({ id }),
    {
      getCachedData(key, nuxtApp) {
        return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
      },
    },
  );
}

export function useContributors() {
  return useLazyAsyncData<ContributorModel[]>(
    "contributors",
    () => new ContributorApi().contributorGet(),
    {
      getCachedData(key, nuxtApp) {
        return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
      },
    },
  );
}
