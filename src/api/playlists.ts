import { PlaylistApi, PlaylistModel } from "@bcc-code/bmm-sdk-fetch";
import client from "./client";

export const list = async () => client.attach(PlaylistApi).playlistGet();

export const get = async (id: NonNullable<PlaylistModel["id"]>) =>
  client.attach(PlaylistApi).playlistIdGet({ id });
