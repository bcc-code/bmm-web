import { PodcastApi } from "@bcc-code/bmm-sdk-fetch";
import type { PodcastModel, TrackModel } from "@bcc-code/bmm-sdk-fetch";

interface UsePodcastOptions {
  id: number;
}

export function usePodcast(options: UsePodcastOptions) {
  const { id } = options;

  return reactiveApi(
    useLazyAsyncData<PodcastModel>(
      `podcast-${id}`,
      () => new PodcastApi().podcastIdGet({ id }),
      {
        getCachedData(key, nuxtApp) {
          return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
        },
      },
    ),
  );
}

interface UsePodcastTracksOptions {
  id: number;
}

export function usePodcastTracks(options: UsePodcastTracksOptions) {
  const { id } = options;

  return reactiveApi(
    useLazyAsyncData<TrackModel[]>(
      `podcast-tracks-${id}`,
      () => new PodcastApi().podcastIdTrackGet({ id }),
      {
        getCachedData(key, nuxtApp) {
          return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
        },
      },
    ),
  );
}

export function usePodcasts() {
  return reactiveApi(
    useLazyAsyncData<PodcastModel[]>(
      "podcasts",
      () => new PodcastApi().podcastGet(),
      {
        getCachedData(key, nuxtApp) {
          return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
        },
      },
    ),
  );
}

export function usePodcastShuffle(id: number) {
  return useAsyncData<TrackModel[]>(
    "podcastshuffle",
    () => new PodcastApi().podcastIdShuffleGet({ id }),
    {
      getCachedData(key, nuxtApp) {
        return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
      },
    },
  );
}
