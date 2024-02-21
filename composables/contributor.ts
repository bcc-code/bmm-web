import { ContributorApi } from "@bcc-code/bmm-sdk-fetch";

interface UseContributorOptions {
  id: number;
}

export function useContributor(options: UseContributorOptions) {
  const { id } = options;

  return useLazyAsyncData(`contributor-${id}`, () =>
    new ContributorApi().contributorIdGet({ id }),
  );
}

export function useContributorTracks(options: UseContributorOptions) {
  const { id } = options;

  return useLazyAsyncData(`contributor-${id}-tracks`, () =>
    new ContributorApi().contributorIdTrackGet({ id }),
  );
}

export function useContributorShuffle(id: number) {
  console.log("load for id", id);
  return useAsyncData(`contributor-${id}-shuffle`, () =>
    new ContributorApi().contributorIdRandomGet({ id }),
  );
}
