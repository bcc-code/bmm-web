import {
  PlaylistApi,
  PlaylistModel,
} from "@bcc-code/bmm-sdk-fetch";
import client from "./client";

export const list = async () => {
  return client.attach(PlaylistApi).playlistGet();
};

export const get = async (id: NonNullable<PlaylistModel["id"]>) => {
  return client.attach(PlaylistApi).playlistIdGet({ id });
};
