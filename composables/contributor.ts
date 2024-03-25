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

export function useContributorShuffle(id: number) {
  return useAsyncData(`contributor-${id}-shuffle`, () =>
    new ContributorApi().contributorIdRandomGet({ id }),
  );
}

export function useContributors() {
  return useLazyAsyncData("contributors", () =>
    new ContributorApi().contributorGet(),
  );
}
