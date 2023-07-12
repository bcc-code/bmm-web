export default class MediaTrack {
  audioElement: HTMLAudioElement;

  public loading = false;

  public paused = false;

  public ended = false;

  private p = 0;

  get position() {
    return this.p;
  }

  set position(v) {
    this.p = v;
    this.audioElement.currentTime = v;
  }

  public duration = 0;

  constructor(audioElement: HTMLAudioElement) {
    this.audioElement = audioElement;
    this.audioElement.autoplay = true;
  }

  registerEvents() {
    this.audioElement.addEventListener("loadedmetadata", () => {
      this.duration = this.audioElement.duration;
    });
    this.audioElement.addEventListener("timeupdate", () => {
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
      this.paused = true;
      this.ended = true;
    });
  }

  play() {
    this.audioElement.play();
  }

  pause() {
    this.audioElement.pause();
  }

  destroy() {
    // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Video_and_audio_APIs#stopping_the_video, https://html.spec.whatwg.org/multipage/media.html#best-practices-for-authors-using-media-elements
    this.audioElement.pause();
    this.audioElement.srcObject = null;
  }
}
