import type { TrackModel, TrackReference } from "@bcc-code/bmm-sdk-fetch";

export default function tracksToTrackReferences(
  tracks: TrackModel[] | undefined | null,
) {
  const list: TrackReference[] = [];
  if (!tracks) return list;

  tracks.forEach((track) => {
    if (track.id && track.language)
      list.push({
        id: track.id,
        language: track.language,
      });
  });
  return list;
}
