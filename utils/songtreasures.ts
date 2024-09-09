import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";

export default function getSongtreasuresLink(track: TrackModel) {
  if (!trackIsSong(track)) return undefined;

  const song = track.songbookRelations?.[0];
  if (!song) return undefined;

  /**
   * This always opens the norwegian songbook, since SongTreasures uses
   * the name of the songbook to determine the language.
   *
   * Eg. HV = norwegian, WOTL = english, WDH = german
   */
  return `https://songtreasures.app/songs/${songbookName(song.name)}/${song.id}`;
}
