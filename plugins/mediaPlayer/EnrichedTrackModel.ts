import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";

export default class EnrichedTrackModel {
  constructor(trackModel: TrackModel, originViewModel: string) {
    this.track = trackModel;
    this.originView = originViewModel;
  }

  track: TrackModel;

  originView: string;
}
