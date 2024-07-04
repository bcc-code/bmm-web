import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";

export default class EnrichedTrackModel {
  constructor(trackModel: TrackModel) {
    this.trackModel = trackModel;
  }

  trackModel: TrackModel;
}
