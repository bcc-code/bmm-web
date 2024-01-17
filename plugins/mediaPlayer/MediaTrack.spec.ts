// @vitest-environment happy-dom

import { describe, it, expect, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import MediaTrack from "./MediaTrack";

describe("plugin mediaPlayer MediaTrack", () => {
  describe("init", () => {
    it("starts playing from the start without init-loading", () => {
      // Act
      const audio = {} as unknown as globalThis.HTMLAudioElement;
      const mT = new MediaTrack(audio);

      // Assert
      expect(mT.duration).toBeNaN();
      expect(mT.ended).equal(false);
      expect(mT.loading).equal(false);
      expect(mT.paused).equal(false);
      expect(mT.position).equal(0);
      expect(audio.autoplay).equal(true);
    });
  });

  describe("duration", () => {
    it("reports the updated duration after its known or estimated", async () => {
      // Arrange
      const audio = new Audio();
      const mT = ref(
        new MediaTrack(audio as unknown as globalThis.HTMLAudioElement),
      );

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
        new global.Event("durationchange", {
          bubbles: false,
          cancelable: false,
        }),
      );
      await flushPromises();
      (audio as any).duration = 800;
      audio.dispatchEvent(
        new global.Event("durationchange", {
          bubbles: false,
          cancelable: false,
        }),
      );
      await flushPromises();

      // Assert
      expect(mT.value.duration).equal(800);
      expect(durations).eql([500, 800]);
    });

    it("reports the updated duration as positive infinity if unknown", async () => {
      // Arrange
      const audio = new Audio();
      const mT = ref(
        new MediaTrack(audio as unknown as globalThis.HTMLAudioElement),
      );

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
        new global.Event("durationchange", {
          bubbles: false,
          cancelable: false,
        }),
      );
      await flushPromises();
      (audio as any).duration = +Infinity;
      audio.dispatchEvent(
        new global.Event("durationchange", {
          bubbles: false,
          cancelable: false,
        }),
      );
      await flushPromises();

      // Assert
      expect(mT.value.duration).equal(Number.POSITIVE_INFINITY);
      expect(durations).eql([500, Number.POSITIVE_INFINITY]);
    });
  });

  describe("position", () => {
    it("reports the updated duration after playback has started", async () => {
      // Arrange
      const audio = new Audio();
      const mT = ref(
        new MediaTrack(audio as unknown as globalThis.HTMLAudioElement),
      );

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
        new global.Event("timeupdate", { bubbles: false, cancelable: false }),
      );
      await flushPromises();
      (audio as any).currentTime = 501;
      audio.dispatchEvent(
        new global.Event("timeupdate", { bubbles: false, cancelable: false }),
      );
      await flushPromises();

      // Assert
      expect(mT.value.position).equal(501);
      expect(positions).eql([500, 501]);
    });

    it("only triggers one update if the internal position changes but not the official", async () => {
      // Arrange
      const audio = new Audio();
      const mT = ref(
        new MediaTrack(audio as unknown as globalThis.HTMLAudioElement),
      );

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
        new global.Event("timeupdate", { bubbles: false, cancelable: false }),
      );
      await flushPromises();
      (audio as any).currentTime = 500;
      audio.dispatchEvent(
        new global.Event("timeupdate", { bubbles: false, cancelable: false }),
      );
      await flushPromises();
      (audio as any).currentTime = 500;
      audio.dispatchEvent(
        new global.Event("timeupdate", { bubbles: false, cancelable: false }),
      );
      await flushPromises();
      (audio as any).currentTime = 500;
      audio.dispatchEvent(
        new global.Event("timeupdate", { bubbles: false, cancelable: false }),
      );
      await flushPromises();

      // Assert
      expect(mT.value.position).equal(500);
      expect(positions).eql([500]);
    });

    it("allows the user to set the position (seek)", () => {
      // Arrange
      const audio = new Audio();
      const mT = ref(
        new MediaTrack(audio as unknown as globalThis.HTMLAudioElement),
      );

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
      const audio = new Audio();
      const mT = ref(
        new MediaTrack(audio as unknown as globalThis.HTMLAudioElement),
      );

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
      const audio = new Audio();
      audio.srcObject = new Blob();
      const mT = new MediaTrack(
        audio as unknown as globalThis.HTMLAudioElement,
      );
      // Act
      mT.destroy();

      // Assert
      expect(audio.srcObject).eq(null);
    });

    it("calls `pause()` on the media-element (best practice)", () => {
      // Arrange
      const audio = new Audio();
      const pauseSpy = vi.spyOn(audio, "pause");
      const mT = new MediaTrack(
        audio as unknown as globalThis.HTMLAudioElement,
      );
      // Act
      mT.destroy();

      // Assert
      expect(pauseSpy).toHaveBeenCalledOnce();
    });

    it("sets `autoplay` to `false` (Chrome would restart playback if `srcObject` is set to `null`)", () => {
      // Arrange
      const audio = new Audio();
      const mT = new MediaTrack(
        audio as unknown as globalThis.HTMLAudioElement,
      );
      // Act
      mT.destroy();

      // Assert
      expect(audio.autoplay).eq(false);
    });
  });
});
