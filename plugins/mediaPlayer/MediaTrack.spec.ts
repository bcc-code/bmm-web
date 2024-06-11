// @vitest-environment happy-dom

import { describe, it, expect, vi } from "vitest";
import { HTMLAudioElement, Event } from "happy-dom";
import { flushPromises } from "@vue/test-utils";
import MediaTrack from "./MediaTrack";
import type { AppInsights } from "../3.applicationInsights";

class MediaTrackMock extends MediaTrack {
  public get audioElementMock() {
    return this.audioElement;
  }

  public set audioElementMock(audioElement) {
    this.audioElement = audioElement;
  }
}

const appInsights: AppInsights = {
  event: (_: string, _2: any) => {},
};

describe("plugin mediaPlayer MediaTrack", () => {
  describe("init", () => {
    it("starts playing from the start without init-loading", () => {
      // Act
      const mT = new MediaTrackMock(
        () => Promise.resolve(""),
        () => {},
        () => {},
        appInsights,
      );

      // Assert
      expect(mT.duration).toBeNaN();
      expect(mT.ended).equal(false);
      expect(mT.loading).equal(false);
      expect(mT.paused).equal(false);
      expect(mT.position).equal(0);
      expect(mT.audioElementMock.autoplay).equal(true);
      expect(mT.audioElementMock.src).equal("");
    });

    it("resets the player on error and reports the error", async () => {
      // Arrange
      const audio = new HTMLAudioElement();
      const onError = vi.fn();
      const mT = new MediaTrackMock(
        () => Promise.resolve("myTrack"),
        onError,
        vi.fn(),
        appInsights,
      );
      mT.audioElementMock = audio as unknown as globalThis.HTMLAudioElement;

      // Act
      mT.registerEvents();
      mT.registerSource();
      mT.loading = true;
      (audio as any).duration = 1000;
      audio.dispatchEvent(
        new Event("durationchange", { bubbles: false, cancelable: false }),
      );
      (audio as any).currentTime = 500;
      audio.dispatchEvent(
        new Event("timeupdate", { bubbles: false, cancelable: false }),
      );
      await flushPromises();
      audio.dispatchEvent(
        new Event("error", { bubbles: false, cancelable: false }),
      );
      await flushPromises();

      // Assert
      expect(mT.duration).equal(1000);
      expect(mT.ended).equal(false);
      expect(mT.loading).equal(false);
      expect(mT.paused).equal(true);
      expect(mT.position).equal(500);
      expect(mT.audioElementMock).not.equal(audio);
      expect(mT.audioElementMock.autoplay).equal(true);
      expect(mT.audioElementMock.src).equal("");
      expect(mT.audioElementMock.currentTime).equal(500);
      expect(onError).toHaveBeenCalledOnce();
    });
  });

  describe("registerSource", () => {
    it("sets the source when the promise resolves", async () => {
      // Arrange
      const mT = new MediaTrackMock(
        () => Promise.resolve("myTrack"),
        () => {},
        vi.fn(),
        appInsights,
      );

      // Act
      mT.registerSource();
      await flushPromises();

      // Assert
      expect(mT.audioElementMock.src).equal("myTrack");
      expect(mT.ended).equal(false);
    });

    it("sets the track to 'paused' if the src-promise rejects", async () => {
      // Arrange
      const mT = ref(
        new MediaTrackMock(
          () => Promise.reject(new Error("Test")),
          () => {},
          vi.fn(),
          appInsights,
        ),
      );
      const pauses: boolean[] = [];
      watch(
        () => mT.value.paused,
        (v) => {
          pauses.push(v);
        },
      );

      // Act
      mT.value.registerSource();
      await flushPromises();

      // Assert
      expect(mT.value.audioElementMock.src).equal("");
      expect(mT.value.paused).equal(true);
      expect(pauses).eql([true]);
    });
  });

  describe("duration", () => {
    it("reports the updated duration after its known or estimated", async () => {
      // Arrange
      const audio = new HTMLAudioElement();
      const mT = ref(
        new MediaTrackMock(
          () => Promise.resolve(""),
          () => {},
          vi.fn(),
          appInsights,
        ),
      );
      mT.value.audioElementMock =
        audio as unknown as globalThis.HTMLAudioElement;

      const durations: number[] = [];
      watch(
        () => mT.value.duration,
        (v) => {
          durations.push(v);
        },
      );
      mT.value.registerEvents();

      // Act
      await flushPromises();
      (audio as any).duration = 500;
      audio.dispatchEvent(
        new Event("durationchange", { bubbles: false, cancelable: false }),
      );
      await flushPromises();
      (audio as any).duration = 800;
      audio.dispatchEvent(
        new Event("durationchange", { bubbles: false, cancelable: false }),
      );
      await flushPromises();

      // Assert
      expect(mT.value.duration).equal(800);
      expect(durations).eql([500, 800]);
    });

    it("reports the updated duration as positive infinity if unknown", async () => {
      // Arrange
      const audio = new HTMLAudioElement();
      const mT = ref(
        new MediaTrackMock(
          () => Promise.resolve("myTrack"),
          () => {},
          vi.fn(),
          appInsights,
        ),
      );
      mT.value.audioElementMock =
        audio as unknown as globalThis.HTMLAudioElement;

      const durations: number[] = [];
      watch(
        () => mT.value.duration,
        (v) => {
          durations.push(v);
        },
      );
      mT.value.registerEvents();

      // Act
      await flushPromises();
      (audio as any).duration = 500;
      audio.dispatchEvent(
        new Event("durationchange", { bubbles: false, cancelable: false }),
      );
      await flushPromises();
      (audio as any).duration = +Infinity;
      audio.dispatchEvent(
        new Event("durationchange", { bubbles: false, cancelable: false }),
      );
      await flushPromises();

      // Assert
      expect(mT.value.duration).equal(Number.POSITIVE_INFINITY);
      expect(durations).eql([500, Number.POSITIVE_INFINITY]);
    });
  });

  describe("paused", () => {
    it("reports the updated paused-state if action is triggered", async () => {
      // Arrange
      const audio = new HTMLAudioElement();
      const mT = ref(
        new MediaTrackMock(
          () => Promise.resolve("myTrack"),
          () => {},
          vi.fn(),
          appInsights,
        ),
      );
      mT.value.audioElementMock =
        audio as unknown as globalThis.HTMLAudioElement;

      const pauses: boolean[] = [];
      watch(
        () => mT.value.paused,
        (v) => {
          pauses.push(v);
        },
      );
      mT.value.registerEvents();

      // Act
      await flushPromises();
      audio.dispatchEvent(
        new Event("pause", { bubbles: false, cancelable: false }),
      );
      await flushPromises();
      audio.dispatchEvent(
        new Event("play", { bubbles: false, cancelable: false }),
      );
      await flushPromises();

      // Assert
      expect(mT.value.paused).equal(false);
      expect(pauses).eql([true, false]);
    });
  });

  describe("ended", () => {
    it("reports the updated ended-state if action is triggered", async () => {
      // Arrange
      const audio = new HTMLAudioElement();
      const mT = ref(
        new MediaTrackMock(
          () => Promise.resolve("myTrack"),
          () => {},
          vi.fn(),
          appInsights,
        ),
      );
      mT.value.audioElementMock =
        audio as unknown as globalThis.HTMLAudioElement;

      const ends: boolean[] = [];
      watch(
        () => mT.value.ended,
        (v) => {
          ends.push(v);
        },
      );
      mT.value.registerEvents();

      // Act
      await flushPromises();
      audio.dispatchEvent(
        new Event("ended", { bubbles: false, cancelable: false }),
      );
      await flushPromises();

      // Assert
      expect(mT.value.ended).equal(true);
      expect(ends).eql([true]);
    });
  });

  describe("position", () => {
    it("reports the updated duration after playback has started", async () => {
      // Arrange
      const audio = new HTMLAudioElement();
      const mT = ref(
        new MediaTrackMock(
          () => Promise.resolve("myTrack"),
          () => {},
          vi.fn(),
          appInsights,
        ),
      );
      mT.value.audioElementMock =
        audio as unknown as globalThis.HTMLAudioElement;

      const positions: number[] = [];
      watch(
        () => mT.value.position,
        (v) => {
          positions.push(v);
        },
      );
      mT.value.registerEvents();

      // Act
      await flushPromises();
      (audio as any).currentTime = 500;
      audio.dispatchEvent(
        new Event("timeupdate", { bubbles: false, cancelable: false }),
      );
      await flushPromises();
      (audio as any).currentTime = 501;
      audio.dispatchEvent(
        new Event("timeupdate", { bubbles: false, cancelable: false }),
      );
      await flushPromises();

      // Assert
      expect(mT.value.position).equal(501);
      expect(positions).eql([500, 501]);
    });

    it("only triggers one update if the internal position changes but not the official", async () => {
      // Arrange
      const audio = new HTMLAudioElement();
      const mT = ref(
        new MediaTrackMock(
          () => Promise.resolve("myTrack"),
          () => {},
          vi.fn(),
          appInsights,
        ),
      );
      mT.value.audioElementMock =
        audio as unknown as globalThis.HTMLAudioElement;

      const positions: number[] = [];
      watch(
        () => mT.value.position,
        (v) => {
          positions.push(v);
        },
      );
      mT.value.registerEvents();

      // Act
      await flushPromises();
      (audio as any).currentTime = 500;
      audio.dispatchEvent(
        new Event("timeupdate", { bubbles: false, cancelable: false }),
      );
      await flushPromises();
      (audio as any).currentTime = 500;
      audio.dispatchEvent(
        new Event("timeupdate", { bubbles: false, cancelable: false }),
      );
      await flushPromises();
      (audio as any).currentTime = 500;
      audio.dispatchEvent(
        new Event("timeupdate", { bubbles: false, cancelable: false }),
      );
      await flushPromises();
      (audio as any).currentTime = 500;
      audio.dispatchEvent(
        new Event("timeupdate", { bubbles: false, cancelable: false }),
      );
      await flushPromises();

      // Assert
      expect(mT.value.position).equal(500);
      expect(positions).eql([500]);
    });

    it("allows the user to set the position (seek)", () => {
      // Arrange
      const audio = new HTMLAudioElement();
      const mT = ref(
        new MediaTrackMock(
          () => Promise.resolve("myTrack"),
          () => {},
          vi.fn(),
          appInsights,
        ),
      );
      mT.value.audioElementMock =
        audio as unknown as globalThis.HTMLAudioElement;

      const positions: number[] = [];
      watch(
        () => mT.value.position,
        (v) => {
          positions.push(v);
        },
      );
      mT.value.registerEvents();

      // Act
      mT.value.position = 100;

      // Assert
      expect(mT.value.position).equal(100);
      expect(audio.currentTime).equal(100);
    });

    it("skips setting the position (seek) if value is not a finite number", async () => {
      // Arrange
      const audio = new HTMLAudioElement();
      const mT = ref(
        new MediaTrackMock(
          () => Promise.resolve("myTrack"),
          () => {},
          vi.fn(),
          appInsights,
        ),
      );
      mT.value.audioElementMock =
        audio as unknown as globalThis.HTMLAudioElement;

      const positions: number[] = [];
      watch(
        () => mT.value.position,
        (v) => {
          positions.push(v);
        },
      );
      mT.value.registerEvents();

      // Act
      await flushPromises();
      mT.value.position = 100;
      mT.value.position = NaN;
      await flushPromises();

      // Assert
      expect(mT.value.position).equal(100);
      expect(audio.currentTime).equal(100);
      expect(positions).eql([100]);
    });
  });

  describe("play", () => {
    it("resumes an initialized audio-element without setting the source", async () => {
      // Arrange
      const mT = new MediaTrackMock(
        () => Promise.resolve("MyUrl"),
        () => {},
        vi.fn(),
        appInsights,
      );
      mT.audioElementMock.src = "Test";

      // Act
      mT.play();
      await flushPromises();

      // Assert
      expect(mT.audioElementMock.src).equal("Test");
    });

    it("sets the source on a not-initialized audio-element", async () => {
      // Arrange
      const mT = new MediaTrackMock(
        () => Promise.resolve("MyUrl"),
        () => {},
        vi.fn(),
        appInsights,
      );

      // Act
      mT.play();
      await flushPromises();

      // Assert
      expect(mT.audioElementMock.src).equal("MyUrl");
    });
  });

  describe("destroy", () => {
    it("resets the option `srcObject` to `null` (best practice)", () => {
      // Arrange
      const audio: HTMLAudioElement & { srcObject?: {} | null } =
        new HTMLAudioElement();
      audio.srcObject = {};
      const mT = new MediaTrackMock(
        () => Promise.resolve("myTrack"),
        () => {},
        vi.fn(),
        appInsights,
      );
      mT.audioElementMock = audio as unknown as globalThis.HTMLAudioElement;

      // Act
      mT.destroy();

      // Assert
      expect(audio.srcObject).eq(null);
    });

    it("calls `pause()` on the media-element (best practice)", () => {
      // Arrange
      const audio = new HTMLAudioElement();
      const pauseSpy = vi.spyOn(audio, "pause");
      const mT = new MediaTrackMock(
        () => Promise.resolve("myTrack"),
        () => {},
        vi.fn(),
        appInsights,
      );
      mT.audioElementMock = audio as unknown as globalThis.HTMLAudioElement;

      // Act
      mT.destroy();

      // Assert
      expect(pauseSpy).toHaveBeenCalledOnce();
    });

    it("sets `autoplay` to `false` (Chrome would restart playback if `srcObject` is set to `null`)", () => {
      // Arrange
      const audio = new HTMLAudioElement();
      const mT = new MediaTrackMock(
        () => Promise.resolve("myTrack"),
        () => {},
        vi.fn(),
        appInsights,
      );
      mT.audioElementMock = audio as unknown as globalThis.HTMLAudioElement;

      // Act
      mT.destroy();

      // Assert
      expect(audio.autoplay).eq(false);
    });
  });
});
