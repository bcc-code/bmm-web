import type {
  TrackModel,
  TrackModelMedium,
  TrackModelMediumFile,
} from "@bcc-code/bmm-sdk-fetch";

export function defaultFileInMedia(
  media: TrackModelMedium[],
): TrackModelMediumFile | undefined {
  return media.find((m) => m.files != null)?.files![0];
}

export function defaultFileForTrack(
  track: TrackModel,
): TrackModelMediumFile | undefined {
  if (!track.media) return undefined;
  return defaultFileInMedia(track.media);
}
