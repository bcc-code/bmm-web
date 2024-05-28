import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";

export default function trackFields(track: TrackModel) {
  const songBook = track.songbookRelations?.map(
    (r) => `${songbookName(r.name)} ${r.id}`,
  )[0];
  const parts = [track.title, songBook, track.meta.artist, track.meta.album];
  const filtered = parts.filter((part) => part);
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
