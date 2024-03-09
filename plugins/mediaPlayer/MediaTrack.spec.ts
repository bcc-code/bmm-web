// @vitest-environment happy-dom

import { describe, it, expect, vi } from "vitest";
import { HTMLAudioElement, Event } from "happy-dom";
import { flushPromises } from "@vue/test-utils";
import MediaTrack from "./MediaTrack";

class MediaTrackMock extends MediaTrack {
  public get audioElementMock() {
    return this.audioElement;
  }

  public set audioElementMock(audioElement) {
    this.audioElement = audioElement;
  }
}

describe("plugin mediaPlayer MediaTrack", () => {
  describe("init", () => {
    it("starts playing from the start without init-loading", () => {
      // Act
      const mT = new MediaTrackMock();

      // Assert
      expect(mT.duration).toBeNaN();
      expect(mT.ended).equal(false);
      expect(mT.loading).equal(false);
      expect(mT.paused).equal(false);
      expect(mT.position).equal(0);
      expect(mT.audioElementMock.autoplay).equal(true);
      expect(mT.audioElementMock.src).equal("");
    });
  });

  describe("registerSource", () => {
    it("sets the source when the promise resolves", async () => {
      // Arrange
      const mT = new MediaTrackMock();

      // Act
      mT.registerSource(Promise.resolve("myTrack"));
      await flushPromises();

      // Assert
      expect(mT.audioElementMock.src).equal("myTrack");
      expect(mT.ended).equal(false);
    });

    it("ends the track if the src-promise rejects", async () => {
      // Arrange
      const mT = ref(new MediaTrackMock());
      const endeds: boolean[] = [];
      watch(
        () => mT.value.ended,
        (v) => {
          endeds.push(v);
        },
      );

      // Act
      mT.value.registerSource(Promise.reject(new Error("Test")));
      await flushPromises();

      // Assert
      expect(mT.value.audioElementMock.src).equal("");
      expect(mT.value.ended).equal(true);
      expect(endeds).eql([true]);
    });
  });

  describe("duration", () => {
    it("reports the updated duration after its known or estimated", async () => {
      // Arrange
      const audio = new HTMLAudioElement();
      const mT = ref(new MediaTrackMock());
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
      const mT = ref(new MediaTrackMock());
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
      const mT = ref(new MediaTrackMock());
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
      const mT = ref(new MediaTrackMock());
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
      const mT = ref(new MediaTrackMock());
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
      const mT = ref(new MediaTrackMock());
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
      const mT = ref(new MediaTrackMock());
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
      const mT = ref(new MediaTrackMock());
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

  describe("destroy", () => {
    it("resets the option `srcObject` to `null` (best practice)", () => {
      // Arrange
      const audio: HTMLAudioElement & { srcObject?: {} | null } =
        new HTMLAudioElement();
      audio.srcObject = {};
      const mT = new MediaTrackMock();
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
      const mT = new MediaTrackMock();
      mT.audioElementMock = audio as unknown as globalThis.HTMLAudioElement;

      // Act
      mT.destroy();

      // Assert
      expect(pauseSpy).toHaveBeenCalledOnce();
    });

    it("sets `autoplay` to `false` (Chrome would restart playback if `srcObject` is set to `null`)", () => {
      // Arrange
      const audio = new HTMLAudioElement();
      const mT = new MediaTrackMock();
      mT.audioElementMock = audio as unknown as globalThis.HTMLAudioElement;

      // Act
      mT.destroy();

      // Assert
      expect(audio.autoplay).eq(false);
    });
  });
});
