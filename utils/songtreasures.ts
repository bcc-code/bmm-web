import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";

export default function getSongtreasuresLink(track: TrackModel) {
  if (!trackIsSong(track)) return undefined;

  const song = track.songbookRelations?.[0];
  if (!song) return undefined;

  return `https://songtreasures.app/songs/${songbookName(song.name)}/${song.id}`;
}
