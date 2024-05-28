import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";

export function trackSongNumber(track: TrackModel) {
  return track.songbookRelations?.map(
    (r) => `${songbookName(r.name)} ${r.id}`,
  )[0];
}

export default function trackFields(track: TrackModel) {
  const parts = [
    track.title,
    trackSongNumber(track),
    track.meta.artist,
    track.meta.album,
  ];
  const filtered = parts.filter(Boolean);
  return {
    title: filtered[0],
    subtitle: filtered.slice(1).join(" - "),
  };
}

export function trackTitleField(track: TrackModel) {
  return trackFields(track).title || "";
}

export function trackSubtitleField(track: TrackModel) {
  return trackFields(track).subtitle;
}
