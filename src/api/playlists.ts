import { PlaylistApi, PlaylistModel } from "@bcc-code/bmm-sdk-fetch";
import client from "./client";

export const list = async () => client.use(PlaylistApi).playlistGet();

export const get = async (id: NonNullable<PlaylistModel["id"]>) =>
  client.use(PlaylistApi).playlistIdGet({ id });
export const getTracks = async (id: NonNullable<PlaylistModel["id"]>) =>
  client.use(PlaylistApi).playlistIdTrackGet({ id });
