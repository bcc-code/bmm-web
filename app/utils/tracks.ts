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

export function trackIsSong(track: TrackModel): boolean {
  return track.subtype === "song" || track.subtype === "singsong";
}

export function coverForTrack(
  track: TrackModel | undefined,
): string | null | undefined {
  return (
    track?.cover ??
    track?.meta.attachedPicture ??
    track?.meta.parent?.cover ??
    track?.meta.rootParent?.cover
  );
}
