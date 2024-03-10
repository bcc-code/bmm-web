/**
 * Changes should always be done with the specification for HTMLAudioElement in mind.
 * This class should be a simple wrapper making the HTML element vue-agnostic.
 * https://html.spec.whatwg.org/multipage/media.html
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement
 */
export default class MediaTrack {
  protected audioElement: HTMLAudioElement;

  public loading = false;

  public paused = false;

  public ended = false;

  private p = 0;

  /**
   * Returns only relative numbers
   */
  public get position() {
    return this.p;
  }

  /**
   * Only relative numbers
   */
  public set position(v) {
    if (!Number.isFinite(v)) {
      return; // Ignore
    }

    this.p = v;
    this.audioElement.currentTime = v;
  }

  private d = NaN;

  /**
   * Possible values are:
   * relative number if known
   * NaN if loading the source
   * +Infinite if stream without known ending
   */
  public get duration() {
    return this.d;
  }

  private srcGenerator;

  /**
   *
   * @param audioElement
   * @param debug Enables logging of all internal changes. Useful when debugging internals of this class.
   */
  constructor(srcGen: () => Promise<string>, debug = false) {
    this.srcGenerator = srcGen;

    this.audioElement = new Audio();
    this.audioElement.autoplay = true;

    /* c8 ignore start */
    if (debug) {
      // Log all events an audio-element has according to https://html.spec.whatwg.org/multipage/media.html#mediaevents
      // This can be done without a separate method because it doesn't use `this`
      this.audioElement.addEventListener("loadstart", (e) =>
        console.log("loadstart", e),
      );
      this.audioElement.addEventListener("progress", (e) =>
        console.log("progress", e),
      );
      this.audioElement.addEventListener("suspend", (e) =>
        console.log("suspend", e),
      );
      this.audioElement.addEventListener("abort", (e) =>
        console.log("abort", e),
      );
      this.audioElement.addEventListener("error", (e) =>
        console.log("error", e, this.audioElement.error),
      );
      this.audioElement.addEventListener("emptied", (e) =>
        console.log("emptied", e),
      );
      this.audioElement.addEventListener("stalled", (e) =>
        console.log("stalled", e),
      );
      this.audioElement.addEventListener("loadedmetadata", (e) =>
        console.log("loadedmetadata", e),
      );
      this.audioElement.addEventListener("loadeddata", (e) =>
        console.log("loadeddata", e),
      );
      this.audioElement.addEventListener("canplay", (e) =>
        console.log("canplay", e),
      );
      this.audioElement.addEventListener("canplaythrough", (e) =>
        console.log("canplaythrough", e),
      );
      this.audioElement.addEventListener("playing", (e) =>
        console.log("playing", e),
      );
      this.audioElement.addEventListener("waiting", (e) =>
        console.log("waiting", e),
      );
      this.audioElement.addEventListener("seeking", (e) =>
        console.log("seeking", e),
      );
      this.audioElement.addEventListener("seeked", (e) =>
        console.log("seeked", e),
      );
      this.audioElement.addEventListener("ended", (e) =>
        console.log("ended", e),
      );
      this.audioElement.addEventListener("durationchange", (e) =>
        console.log("durationchange", e),
      );
      this.audioElement.addEventListener("timeupdate", (e) =>
        console.log("timeupdate", e),
      );
      this.audioElement.addEventListener("play", (e) => console.log("play", e));
      this.audioElement.addEventListener("pause", (e) =>
        console.log("pause", e),
      );
      this.audioElement.addEventListener("ratechange", (e) =>
        console.log("ratechange", e),
      );
      this.audioElement.addEventListener("volumechange", (e) =>
        console.log("volumechange", e),
      );
    }
    /* c8 ignore stop */
  }

  /**
   * Registering the source in a separate method is needed when
   * you want to have the element reactive. This method
   * has to be called after wrapping the object into `ref()`
   * for `this` to be the proxy created for reactivity.
   */
  registerSource() {
    this.srcGenerator()
      .then((_src) => {
        if (!this.ended) {
          this.audioElement.src = _src;
        }
      })
      .catch((_) => {
        this.paused = true;
      });
  }

  /**
   * Registering the events in a separate method is needed when
   * you want to have the element reactive. This method
   * has to be called after wrapping the object into `ref()`
   * for `this` to be the proxy created for reactivity.
   */
  registerEvents() {
    this.audioElement.addEventListener("durationchange", () => {
      this.d = this.audioElement.duration;
    });
    this.audioElement.addEventListener("timeupdate", () => {
      /*
      In the specs you'll find that this event triggers on `current playback position`
      but the property `currentTime` returns the `official playback position`.
      The current playback position seems to be subject to more fluctuations.
      Vue already does a good job in trying  to keep the changes to a minimum by
      not updating if the value hasn't changed since the last update.
      */
      this.p = this.audioElement.currentTime;
    });
    this.audioElement.addEventListener("pause", () => {
      this.paused = true;
    });
    this.audioElement.addEventListener("loadstart", () => {
      this.loading = true;
    });
    this.audioElement.addEventListener("loadeddata", () => {
      this.loading = false;
    });
    this.audioElement.addEventListener("play", () => {
      this.paused = false;
      this.ended = false;
    });
    this.audioElement.addEventListener("ended", () => {
      this.ended = true;
    });
  }

  play() {
    if (this.audioElement.currentSrc) {
      this.audioElement.play();
    } else {
      this.registerSource();
    }
  }

  pause() {
    this.audioElement.pause();
  }

  destroy() {
    // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Video_and_audio_APIs#stopping_the_video, https://html.spec.whatwg.org/multipage/media.html#best-practices-for-authors-using-media-elements
    this.audioElement.autoplay = false;
    this.audioElement.pause();
    this.audioElement.srcObject = null;
  }
}
