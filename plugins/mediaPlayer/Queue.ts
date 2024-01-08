import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";

export default class Queue extends Array<TrackModel> {
  public isShuffled = false;

  private i = 0;

  public get index() {
    return this.i;
  }

  public set index(v) {
    if (v >= this.length) {
      this.i = this.length - 1;
    } else if (v < 0) {
      if (this.length > 0) {
        this.i = 0;
      } else {
        this.i = -1;
      }
    } else {
      this.i = v;
    }
    this.cT = this[this.i];
  }

  private cT: TrackModel | undefined;

  public get currentTrack() {
    return this.cT;
  }

  private sortedArray: Array<TrackModel> | undefined;

  constructor(data: TrackModel[] = [], index = -1) {
    super();

    if (Array.isArray(data)) {
      data.forEach((el, i) => {
        this[i] = el;
      });
    }

    this.index = index;
  }

  public shuffle() {
    if (this.sortedArray) return;

    const playingTrack = this.currentTrack;
    this.sortedArray = [...this];
    this.sort((a, b) => {
      if (a === this.currentTrack) return -1;
      if (b === this.currentTrack) return 1;
      return Math.random() - 0.5;
    });
    this.isShuffled = true;
    this.i = this.findIndex((v) => v === playingTrack) || 0;
  }

  public unshuffle() {
    if (!this.sortedArray) return;

    const playingTrack = this.currentTrack;
    this.sortedArray.forEach((el, i) => {
      this[i] = el;
    });
    this.sortedArray = undefined;
    this.isShuffled = false;
    this.i = this.findIndex((v) => v === playingTrack) || 0;
  }
}
