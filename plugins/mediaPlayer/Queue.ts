import type EnrichedTrackModel from "./EnrichedTrackModel";

export default class Queue extends Array<EnrichedTrackModel> {
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

  private cT: EnrichedTrackModel | undefined;

  public get currentTrack() {
    return this.cT;
  }

  private sortedArray: Array<EnrichedTrackModel> | undefined;

  constructor(data: EnrichedTrackModel[] = [], index = -1) {
    super();

    if (Array.isArray(data)) {
      data.forEach((el, i) => {
        this[i] = el;
      });
    }

    this.index = index;
  }

  private reevaluateIndex() {
    this.i = this.findIndex((v) => v === this.currentTrack) || 0;
  }

  public shuffle() {
    if (this.sortedArray) return;

    this.sortedArray = [...this];
    // Erase the queue…
    this.splice(
      // …from start…
      0,
      // …to end…
      this.length,
      // …replace the contents with:
      // The current track in the first position…
      ...(this.currentTrack ? [this.currentTrack] : []),
      // …followed by all other tracks…
      ...this.filter((track) => track !== this.currentTrack)
        // …shuffled using Schwarzian Transform Shuffle
        .map((track) => ({ track, ix: Math.random() }))
        .sort(({ ix: a }, { ix: b }) => a - b)
        .map(({ track }) => track),
    );
    this.isShuffled = true;

    this.reevaluateIndex();
  }

  public unshuffle() {
    if (!this.sortedArray) return;

    this.sortedArray.forEach((el, i) => {
      this[i] = el;
    });
    this.sortedArray = undefined;
    this.isShuffled = false;

    this.reevaluateIndex();
  }

  public moveTrack(fromIndex: number, toIndex: number) {
    const fromTrack = this.at(fromIndex);
    if (!fromTrack) return;

    this.splice(fromIndex, 1);
    this.splice(toIndex, 0, fromTrack);

    this.reevaluateIndex();
  }
}
