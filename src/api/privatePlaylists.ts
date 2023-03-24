import {
  GetTrackCollectionModel,
  TrackCollectionApi,
} from "@bcc-code/bmm-sdk-fetch";
import client from "./client";

export const list = async () =>
  client.use(TrackCollectionApi).trackCollectionGet();

export const get = async (id: NonNullable<GetTrackCollectionModel["id"]>) =>
  client.use(TrackCollectionApi).trackCollectionIdGet({ id });
