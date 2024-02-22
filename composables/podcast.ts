import { PodcastApi } from "@bcc-code/bmm-sdk-fetch";

interface UsePodcastOptions {
  id: number;
}

export function usePodcast(options: UsePodcastOptions) {
  const { id } = options;

  return reactiveApi(
    useLazyAsyncData(`podcast-${id}`, () =>
      new PodcastApi().podcastIdGet({ id }),
    ),
  );
}

interface UsePodcastTracksOptions {
  id: number;
}

export function usePodcastTracks(options: UsePodcastTracksOptions) {
  const { id } = options;

  return reactiveApi(
    useLazyAsyncData(`podcast-tracks-${id}`, () =>
      new PodcastApi().podcastIdTrackGet({ id }),
    ),
  );
}

export function usePodcasts() {
  return reactiveApi(
    useLazyAsyncData("podcasts", () => new PodcastApi().podcastGet()),
  );
}

export function usePodcastShuffle(id: number) {
  return useAsyncData("podcastshuffle", () =>
    new PodcastApi().podcastIdShuffleGet({ id }),
  );
}
