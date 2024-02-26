// @vitest-environment happy-dom

import { describe, it, expect, vi, afterEach } from "vitest";
import type { Mock } from "vitest";
import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";
import { flushPromises } from "@vue/test-utils";
import type { UnwrapRef } from "vue";
import type { IUserData } from "../2.userData";
import type { AppInsights } from "../3.applicationInsights";
import Queue from "./Queue";
import MediaTrack from "./MediaTrack";
import { initMediaPlayer, MediaPlayerStatus } from "./mediaPlayer";

vi.mock("./Queue", async (importOriginal) => {
  const { default: Mod } = (await importOriginal()) as any;
  return {
    default: vi.fn().mockImplementation((...args: any[]) => new Mod(...args)),
  };
});

const appInsights = {
  event: (_: string, _2: any) => {},
} as unknown as AppInsights;

const userData: IUserData = { personId: null, age: null, os: "Test" };
const setupPlayer = () =>
  initMediaPlayer(
    () => HTMLAudioElement as unknown as globalThis.HTMLAudioElement,
    appInsights as unknown as AppInsights,
    userData,
  );

let playMocks: Mock[] = vi.hoisted(() => []);
let pauseMocks: Mock[] = vi.hoisted(() => []);
let destroyMocks: Mock[] = vi.hoisted(() => []);
vi.mock("./MediaTrack", async (importOriginal) => {
  const { default: Mod } = (await importOriginal()) as any;
  return {
    default: vi.fn().mockImplementation((...args: any[]) => {
      const obj = new Mod(...args);

      // We need this because we're working with proxies :)
      obj.registerEvents = function registerEvents() {
        if (isProxy(this)) {
          toRaw(this).obj = this;
        }
      };
      const playMock = vi.fn();
      const pauseMock = vi.fn();
      const destroyMock = vi.fn();
      playMocks.push(playMock);
      pauseMocks.push(pauseMock);
      destroyMocks.push(destroyMock);

      obj.play = playMock;
      obj.pause = pauseMock;
      obj.destroy = destroyMock;

      return obj;
    }),
  };
});

describe("plugin mediaPlayer MediaTrack", () => {
  const MockedQueue = vi.mocked(Queue);
  const MockedMediaTrack = vi.mocked(MediaTrack);

  afterEach(() => {
    MockedQueue.mockClear();
    MockedMediaTrack.mockClear();
    playMocks = [];
    pauseMocks = [];
    destroyMocks = [];
  });

  describe("init", () => {
    it("starts playing from the start without init-loading", async () => {
      // Act
      const mediaPlayer = setupPlayer();
      await flushPromises();

      // Assert
      expect(mediaPlayer.status.value).eq(MediaPlayerStatus.Stopped);
      expect(mediaPlayer.isLoading.value).eq(false);
      expect(mediaPlayer.hasNext.value).eq(false);
      expect(mediaPlayer.hasPrevious.value).eq(false);
      expect(mediaPlayer.queue.value.length).eq(0);
      expect(mediaPlayer.currentTrack.value).eq(undefined);
      expect(mediaPlayer.currentPosition.value).toBeNaN();
      expect(mediaPlayer.currentTrackDuration.value).toBeNaN();
    });
  });

  /// Outside method/setter calls

  describe("seeking", () => {
    it("sets the position on the current element", async () => {
      // Arrange
      const mediaPlayer = setupPlayer();
      await flushPromises();
      mediaPlayer.setQueue([{ id: 1, type: "track" }]);
      await flushPromises();

      // Act
      mediaPlayer.currentPosition.value = 100;
      await flushPromises();

      // Assert
      expect(MockedMediaTrack.mock.results[0]!.value.obj!.position).eq(100);
    });

    it("parses the position to number before passing it on to the current element", async () => {
      // Arrange
      const mediaPlayer = setupPlayer();
      await flushPromises();
      mediaPlayer.setQueue([{ id: 1, type: "track" }]);
      await flushPromises();

      // Act
      mediaPlayer.currentPosition.value = "100" as any; // When used as v-model, the setter must be able to take in anything
      await flushPromises();

      // Assert
      expect(MockedMediaTrack.mock.results[0]!.value.obj!.position).eq(100);
    });

    it("ignores the given position if there is no current element", async () => {
      // Arrange
      const mediaPlayer = setupPlayer();

      // Act
      mediaPlayer.currentPosition.value = 100;
      await flushPromises();

      // Assert
      expect(MediaTrack).not.toHaveBeenCalled();
      expect(mediaPlayer.currentPosition.value).toBeNaN();
    });
  });

  describe("rewind", () => {
    it("subtracts 15 seconds to the position on the current element", async () => {
      // Arrange
      const mediaPlayer = setupPlayer();
      await flushPromises();
      mediaPlayer.setQueue([{ id: 1, type: "track" }]);
      await flushPromises();
      mediaPlayer.currentPosition.value = 100;
      await flushPromises();

      // Act
      mediaPlayer.rewind();
      await flushPromises();

      // Assert
      expect(MockedMediaTrack.mock.results[0]!.value.obj!.position).eq(85);
    });

    it("ignores the rewind-action if there is no current element", async () => {
      // Arrange
      const mediaPlayer = setupPlayer();

      // Act
      mediaPlayer.rewind();
      await flushPromises();

      // Assert
      expect(MediaTrack).not.toHaveBeenCalled();
      expect(mediaPlayer.currentPosition.value).toBeNaN();
    });
  });

  describe("fastForward", () => {
    it("adds 15 seconds to the position on the current element", async () => {
      // Arrange
      const mediaPlayer = setupPlayer();
      await flushPromises();
      mediaPlayer.setQueue([{ id: 1, type: "track" }]);
      await flushPromises();
      mediaPlayer.currentPosition.value = 100;
      await flushPromises();

      // Act
      mediaPlayer.fastForward();
      await flushPromises();

      // Assert
      expect(MockedMediaTrack.mock.results[0]!.value.obj!.position).eq(115);
    });

    it("ignores the fastForward-action if there is no current element", async () => {
      // Arrange
      const mediaPlayer = setupPlayer();

      // Act
      mediaPlayer.fastForward();
      await flushPromises();

      // Assert
      expect(MediaTrack).not.toHaveBeenCalled();
      expect(mediaPlayer.currentPosition.value).toBeNaN();
    });
  });

  describe("play()", () => {
    it("calls `play` function on the current element", async () => {
      // Arrange
      const mediaPlayer = ref(setupPlayer());

      mediaPlayer.value.setQueue([{ id: 1, type: "track" }]);
      await flushPromises();
      mediaPlayer.value.pause();
      playMocks[0]!.mockClear();

      // Act
      mediaPlayer.value.play();
      await flushPromises();

      // Assert
      expect(playMocks).length(1);
      expect(playMocks[0]).toHaveBeenCalledOnce();
    });

    it("inits a new current element if no current element having a non-empty queue", async () => {
      // Arrange
      const mediaPlayer = ref(setupPlayer());
      mediaPlayer.value.setQueue([{ id: 1, type: "track" }]);
      await flushPromises();
      mediaPlayer.value.stop();
      await flushPromises();
      MockedMediaTrack.mockClear();

      // Act
      mediaPlayer.value.play();
      await flushPromises();

      // Assert
      expect(MockedMediaTrack).toHaveBeenCalledOnce();
    });

    it("ignores the action if there is no current element and an empty queue", async () => {
      // Arrange
      const mediaPlayer = ref(setupPlayer());

      // Act
      mediaPlayer.value.play();
      await flushPromises();

      // Assert
      expect(playMocks).length(0);
    });
  });

  describe("pause()", () => {
    it("calls `pause` function on the current element", async () => {
      // Arrange
      const mediaPlayer = ref(setupPlayer());

      mediaPlayer.value.setQueue([{ id: 1, type: "track" }]);
      await flushPromises();
      pauseMocks[0]!.mockClear();

      // Act
      mediaPlayer.value.pause();
      await flushPromises();

      // Assert
      expect(pauseMocks).length(1);
      expect(pauseMocks[0]).toHaveBeenCalledOnce();
    });

    it("ignores the action if there is no current element", async () => {
      // Arrange
      const mediaPlayer = ref(setupPlayer());

      // Act
      mediaPlayer.value.pause();
      await flushPromises();

      // Assert
      expect(pauseMocks).length(0);
    });
  });

  describe("stop()", () => {
    it("clears the current element which resets all properties", async () => {
      // Arrange
      const mediaPlayer = ref(setupPlayer());

      mediaPlayer.value.setQueue([{ id: 1, type: "track" }]);
      await flushPromises();
      const statusChanges: MediaPlayerStatus[] = [];
      watch(
        () => mediaPlayer.value.status,
        (v) => {
          statusChanges.push(v);
        },
      );

      // Act
      mediaPlayer.value.stop();
      await flushPromises();

      // Assert
      expect(mediaPlayer.value.status).eq(MediaPlayerStatus.Stopped);
      expect(statusChanges).eql([MediaPlayerStatus.Stopped]);
      expect(mediaPlayer.value.isLoading).eq(false);
      expect(mediaPlayer.value.hasNext).eq(false);
      expect(mediaPlayer.value.hasPrevious).eq(true);
      expect(mediaPlayer.value.queue.length).eq(1);
      expect(mediaPlayer.value.currentTrack).eql({ id: 1, type: "track" });
      expect(mediaPlayer.value.currentPosition).toBeNaN();
      expect(mediaPlayer.value.currentTrackDuration).toBeNaN();
    });
  });

  describe("next()", () => {
    it("inits the next track as current element", async () => {
      // Arrange
      const mediaPlayer = ref(setupPlayer());

      mediaPlayer.value.setQueue([
        { id: 1, type: "track" },
        { id: 2, type: "track" },
      ]);
      await flushPromises();
      MockedMediaTrack.mockClear();

      const currentTracks: (TrackModel | undefined)[] = [];
      watch(
        () => mediaPlayer.value.currentTrack,
        (v) => {
          currentTracks.push(v);
        },
      );

      // Act
      mediaPlayer.value.next();
      await flushPromises();

      // Assert
      expect(MockedMediaTrack).toHaveBeenCalledOnce();
      expect(currentTracks).eql([{ id: 2, type: "track" }]);
    });

    it("skips the action if there is no next element", async () => {
      // Arrange
      const mediaPlayer = ref(setupPlayer());

      mediaPlayer.value.setQueue([{ id: 1, type: "track" }]);
      await flushPromises();
      MockedMediaTrack.mockClear();

      const currentTracks: (TrackModel | undefined)[] = [];
      watch(
        () => mediaPlayer.value.currentTrack,
        (v) => {
          currentTracks.push(v);
        },
      );

      // Act
      mediaPlayer.value.next();
      await flushPromises();

      // Assert
      expect(MockedMediaTrack).toHaveBeenCalledTimes(0);
      expect(currentTracks).eql([]);
    });

    it("destroys the old element when initializing the new", async () => {
      // Arrange
      const mediaPlayer = ref(setupPlayer());

      mediaPlayer.value.setQueue([
        { id: 1, type: "track" },
        { id: 2, type: "track" },
      ]);
      await flushPromises();

      // Act
      mediaPlayer.value.next();
      await flushPromises();

      // Assert
      expect(destroyMocks).length(2);
      expect(destroyMocks[0]).toHaveBeenCalledOnce();
      expect(destroyMocks[1]).toHaveBeenCalledTimes(0);
    });
  });

  describe("previous()", () => {
    it("inits the previous track as current element", async () => {
      // Arrange
      const mediaPlayer = ref(setupPlayer());

      mediaPlayer.value.setQueue(
        [
          { id: 1, type: "track" },
          { id: 2, type: "track" },
        ],
        1,
      );
      await flushPromises();
      MockedMediaTrack.mockClear();

      const currentTracks: (TrackModel | undefined)[] = [];
      watch(
        () => mediaPlayer.value.currentTrack,
        (v) => {
          currentTracks.push(v);
        },
      );

      // Act
      mediaPlayer.value.previous();
      await flushPromises();

      // Assert
      expect(MockedMediaTrack).toHaveBeenCalledOnce();
      expect(currentTracks).eql([{ id: 1, type: "track" }]);
    });

    it("skips the action if there is no previous element", async () => {
      // Arrange
      const mediaPlayer = ref(setupPlayer());

      mediaPlayer.value.setQueue(
        [
          { id: 1, type: "track" },
          { id: 2, type: "track" },
        ],
        0,
      );
      await flushPromises();
      MockedMediaTrack.mockClear();

      const currentTracks: (TrackModel | undefined)[] = [];
      watch(
        () => mediaPlayer.value.currentTrack,
        (v) => {
          currentTracks.push(v);
        },
      );

      // Act
      mediaPlayer.value.previous();
      await flushPromises();

      // Assert
      expect(MockedMediaTrack).toHaveBeenCalledTimes(0);
      expect(currentTracks).eql([]);
    });

    it("destroys the old element when initializing the new", async () => {
      // Arrange
      const mediaPlayer = ref(setupPlayer());

      mediaPlayer.value.setQueue(
        [
          { id: 1, type: "track" },
          { id: 2, type: "track" },
        ],
        1,
      );
      await flushPromises();

      // Act
      mediaPlayer.value.previous();
      await flushPromises();

      // Assert
      expect(destroyMocks).length(2);
      expect(destroyMocks[0]).toHaveBeenCalledOnce();
      expect(destroyMocks[1]).toHaveBeenCalledTimes(0);
    });
  });

  describe("setQueue()", () => {
    it("replaces the current queue by a new one with an index of 0 if not provided", async () => {
      // Arrange
      const mediaPlayer = ref(setupPlayer());

      MockedQueue.mockClear();
      const oldQueue = mediaPlayer.value.queue;

      const queues: TrackModel[][] = [];
      watch(
        () => mediaPlayer.value.queue,
        (v) => {
          queues.push(v);
        },
      );

      // Act
      mediaPlayer.value.setQueue([
        { id: 1, type: "track" },
        { id: 2, type: "track" },
      ]);
      await flushPromises();

      // Assert
      expect(MockedQueue).toHaveBeenCalledOnce();
      expect(mediaPlayer.value.queue).length(2);
      expect(mediaPlayer.value.queue).not.eq(oldQueue);
      expect(mediaPlayer.value.queue.index).eq(0);
      expect(queues.length).eq(1);
    });

    it("sets the index on the queue if provided", async () => {
      // Arrange
      const mediaPlayer = ref(setupPlayer());

      // Act
      mediaPlayer.value.setQueue(
        [
          { id: 1, type: "track" },
          { id: 2, type: "track" },
        ],
        1,
      );
      await flushPromises();

      // Assert
      expect(mediaPlayer.value.queue.index).eq(1);
    });

    it("initializes the current element", async () => {
      // Arrange
      const mediaPlayer = ref(setupPlayer());

      const currentTracks: (TrackModel | undefined)[] = [];
      watch(
        () => mediaPlayer.value.currentTrack,
        (v) => {
          currentTracks.push(v);
        },
      );
      MockedMediaTrack.mockClear();

      // Act
      mediaPlayer.value.setQueue(
        [
          { id: 1, type: "track" },
          { id: 2, type: "track" },
        ],
        1,
      );
      await flushPromises();

      // Assert
      expect(MockedMediaTrack).toHaveBeenCalledOnce();
      expect(currentTracks).eql([{ id: 2, type: "track" }]);
    });
  });

  describe("setQueueShuffled()", () => {
    it(
      "replaces the current queue by a new one with a random index (2)",
      async () => {
        // Arrange
        const mediaPlayer = ref(setupPlayer());

        // Act
        mediaPlayer.value.setQueueShuffled([
          { id: 1, type: "track" },
          { id: 2, type: "track" },
          { id: 3, type: "track" },
        ]);
        await flushPromises();

        // Assert
        expect(mediaPlayer.value.queue).length(3);
        expect(mediaPlayer.value.queue.index).eq(0);
        expect(mediaPlayer.value.queue[0]?.id).eq(2);
        expect(mediaPlayer.value.queue[1]?.id).eq(1);
        expect(mediaPlayer.value.queue[2]?.id).eq(3);
      },
      { retry: 100 },
    );
  });

  describe("addToQueue()", () => {
    it("adds an element to the end of the queue if current element is set", async () => {
      // Arrange
      const mediaPlayer = ref(setupPlayer());

      mediaPlayer.value.setQueue([
        { id: 1, type: "track" },
        { id: 2, type: "track" },
      ]);
      await flushPromises();

      const currentTracks: (TrackModel | undefined)[] = [];
      watch(
        () => mediaPlayer.value.currentTrack,
        (v) => {
          currentTracks.push(v);
        },
      );
      MockedMediaTrack.mockClear();

      // Act
      mediaPlayer.value.addToQueue({ id: 3, type: "track" });
      await flushPromises();

      // Assert
      expect(MockedMediaTrack).toHaveBeenCalledTimes(0);
      expect(currentTracks).eql([]);
      expect(mediaPlayer.value.queue).eql([
        { id: 1, type: "track" },
        { id: 2, type: "track" },
        { id: 3, type: "track" },
      ]);
    });

    it("adds an element to the queue and start playing if queue is empty", async () => {
      // Arrange
      const mediaPlayer = ref(setupPlayer());

      const currentTracks: (TrackModel | undefined)[] = [];
      watch(
        () => mediaPlayer.value.currentTrack,
        (v) => {
          currentTracks.push(v);
        },
      );
      MockedMediaTrack.mockClear();

      // Act
      mediaPlayer.value.addToQueue({ id: 3, type: "track" });
      await flushPromises();

      // Assert
      expect(MockedMediaTrack).toHaveBeenCalledTimes(1);
      expect(currentTracks).eql([{ id: 3, type: "track" }]);
      expect(mediaPlayer.value.queue).eql([{ id: 3, type: "track" }]);
    });

    it("adds an element to the queue and start playing if queue has finished playing", async () => {
      // Arrange
      const mediaPlayer = ref(setupPlayer());

      mediaPlayer.value.setQueue(
        [
          { id: 1, type: "track" },
          { id: 2, type: "track" },
        ],
        1,
      );
      await flushPromises();

      MockedMediaTrack.mock.results[0]!.value.obj!.paused = true;
      MockedMediaTrack.mock.results[0]!.value.obj!.ended = true;
      await flushPromises();

      const currentTracks: (TrackModel | undefined)[] = [];
      watch(
        () => mediaPlayer.value.currentTrack,
        (v) => {
          currentTracks.push(v);
        },
      );
      MockedMediaTrack.mockClear();

      // Act
      mediaPlayer.value.addToQueue({ id: 3, type: "track" });
      await flushPromises();

      // Assert
      expect(MockedMediaTrack).toHaveBeenCalledTimes(1);
      expect(currentTracks).eql([{ id: 3, type: "track" }]);
      expect(mediaPlayer.value.queue).eql([
        { id: 1, type: "track" },
        { id: 2, type: "track" },
        { id: 3, type: "track" },
      ]);
    });
  });

  describe("addNext()", () => {
    it("adds an element to the queue next to the current element if current element is set", async () => {
      // Arrange
      const mediaPlayer = ref(setupPlayer());

      mediaPlayer.value.setQueue([
        { id: 1, type: "track" },
        { id: 3, type: "track" },
      ]);
      await flushPromises();

      const currentTracks: (TrackModel | undefined)[] = [];
      watch(
        () => mediaPlayer.value.currentTrack,
        (v) => {
          currentTracks.push(v);
        },
      );
      MockedMediaTrack.mockClear();

      // Act
      mediaPlayer.value.addNext({ id: 2, type: "track" });
      await flushPromises();

      // Assert
      expect(MockedMediaTrack).toHaveBeenCalledTimes(0);
      expect(currentTracks).eql([]);
      expect(mediaPlayer.value.queue).eql([
        { id: 1, type: "track" },
        { id: 2, type: "track" },
        { id: 3, type: "track" },
      ]);
    });

    it("adds an element to the queue next to the current element if another track has been added and current element is set", async () => {
      // Arrange
      const mediaPlayer = ref(setupPlayer());

      mediaPlayer.value.setQueue([
        { id: 1, type: "track" },
        { id: 4, type: "track" },
      ]);
      await flushPromises();

      // Act
      mediaPlayer.value.addNext({ id: 3, type: "track" });
      mediaPlayer.value.addNext({ id: 2, type: "track" });
      await flushPromises();

      // Assert
      expect(mediaPlayer.value.queue).eql([
        { id: 1, type: "track" },
        { id: 2, type: "track" },
        { id: 3, type: "track" },
        { id: 4, type: "track" },
      ]);
    });

    it("adds an element to the queue and start playing if queue is empty", async () => {
      // Arrange
      const mediaPlayer = ref(setupPlayer());

      const currentTracks: (TrackModel | undefined)[] = [];
      watch(
        () => mediaPlayer.value.currentTrack,
        (v) => {
          currentTracks.push(v);
        },
      );
      MockedMediaTrack.mockClear();

      // Act
      mediaPlayer.value.addNext({ id: 3, type: "track" });
      await flushPromises();

      // Assert
      expect(MockedMediaTrack).toHaveBeenCalledTimes(1);
      expect(currentTracks).eql([{ id: 3, type: "track" }]);
      expect(mediaPlayer.value.queue).eql([{ id: 3, type: "track" }]);
    });

    it("adds an element to the queue next to the current element and start playing if queue has finished playing", async () => {
      // Arrange
      const mediaPlayer = ref(setupPlayer());

      mediaPlayer.value.setQueue(
        [
          { id: 1, type: "track" },
          { id: 2, type: "track" },
        ],
        1,
      );
      await flushPromises();

      MockedMediaTrack.mock.results[0]!.value.obj!.paused = true;
      MockedMediaTrack.mock.results[0]!.value.obj!.ended = true;
      await flushPromises();

      const currentTracks: (TrackModel | undefined)[] = [];
      watch(
        () => mediaPlayer.value.currentTrack,
        (v) => {
          currentTracks.push(v);
        },
      );
      MockedMediaTrack.mockClear();

      // Act
      mediaPlayer.value.addNext({ id: 3, type: "track" });
      await flushPromises();

      // Assert
      expect(MockedMediaTrack).toHaveBeenCalledTimes(1);
      expect(currentTracks).eql([{ id: 3, type: "track" }]);
      expect(mediaPlayer.value.queue).eql([
        { id: 1, type: "track" },
        { id: 2, type: "track" },
        { id: 3, type: "track" },
      ]);
    });
  });

  /// Inside updates

  describe("while playing a track", () => {
    describe("currentPosition", () => {
      it("updates the position of the current element as it changes", async () => {
        // Arrange
        const mediaPlayer = ref(setupPlayer());

        const positions: number[] = [];
        watch(
          () => mediaPlayer.value.currentPosition,
          (v) => {
            positions.push(v);
          },
        );

        // Act
        mediaPlayer.value.setQueue([{ id: 1, type: "track" }]);
        await flushPromises();
        MockedMediaTrack.mock.results[0]!.value.obj!.position = 100;
        await flushPromises();
        MockedMediaTrack.mock.results[0]!.value.obj!.position = 105;
        await flushPromises();

        // Assert
        expect(MediaTrack).toHaveBeenCalledOnce();
        expect(positions).eql([0, 100, 105]);
        expect(mediaPlayer.value.currentPosition).eq(105);
      });

      it("updates to the initial position of the new current element", async () => {
        // Arrange
        const mediaPlayer = ref(setupPlayer());

        mediaPlayer.value.setQueue([{ id: 1, type: "track" }]);
        await flushPromises();

        MockedMediaTrack.mock.results[0]!.value.obj!.position = 100;
        await flushPromises();

        const positions: number[] = [];
        watch(
          () => mediaPlayer.value.currentPosition,
          (v) => {
            positions.push(v);
          },
        );

        // Act
        mediaPlayer.value.setQueue([{ id: 1, type: "track" }]);
        await flushPromises();

        // Assert
        expect(MediaTrack).toHaveBeenCalledTimes(2);
        expect(MockedMediaTrack.mock.results[1]!.value.p).eq(0);
        expect(positions).eql([0]);
        expect(mediaPlayer.value.currentPosition).eq(0);
      });

      it("updates to the NaN if player is stopped", async () => {
        // Arrange
        const mediaPlayer = ref(setupPlayer());

        mediaPlayer.value.setQueue([{ id: 1, type: "track" }]);
        await flushPromises();

        MockedMediaTrack.mock.results[0]!.value.obj!.position = 100;
        await flushPromises();

        const positions: number[] = [];
        watch(
          () => mediaPlayer.value.currentPosition,
          (v) => {
            positions.push(v);
          },
        );

        // Act
        mediaPlayer.value.stop();
        await flushPromises();

        // Assert
        expect(MediaTrack).toHaveBeenCalledOnce();
        expect(positions).eql([NaN]);
        expect(mediaPlayer.value.currentPosition).toBeNaN();
      });
    });

    describe("play/pause", () => {
      it("shows the the player as paused when the MediaTrack responds", async () => {
        // Arrange
        const mediaPlayer = ref(setupPlayer());

        mediaPlayer.value.setQueue([{ id: 1, type: "track" }]);
        await flushPromises();

        const statusValues: MediaPlayerStatus[] = [];
        watch(
          () => mediaPlayer.value.status,
          (v) => {
            statusValues.push(v);
          },
        );

        // Act
        MockedMediaTrack.mock.results[0]!.value.obj!.paused = true;
        await flushPromises();

        // Assert
        expect(statusValues).eql([MediaPlayerStatus.Paused]);
      });

      it("shows the the player as resuming when the MediaTrack responds", async () => {
        // Arrange
        const mediaPlayer = ref(setupPlayer());

        mediaPlayer.value.setQueue([{ id: 1, type: "track" }]);
        await flushPromises();
        MockedMediaTrack.mock.results[0]!.value.obj!.paused = true;
        await flushPromises();

        const statusValues: MediaPlayerStatus[] = [];
        watch(
          () => mediaPlayer.value.status,
          (v) => {
            statusValues.push(v);
          },
        );

        // Act
        MockedMediaTrack.mock.results[0]!.value.obj!.paused = false;
        await flushPromises();

        // Assert
        expect(statusValues).eql([MediaPlayerStatus.Playing]);
      });
    });

    describe("isLoading", () => {
      it("shows the the player as loading when the MediaTrack responds", async () => {
        // Arrange
        const mediaPlayer = ref(setupPlayer());

        mediaPlayer.value.setQueue([{ id: 1, type: "track" }]);
        await flushPromises();

        const isLoadingValues: Boolean[] = [];
        watch(
          () => mediaPlayer.value.isLoading,
          (v) => {
            isLoadingValues.push(v);
          },
        );

        // Act
        MockedMediaTrack.mock.results[0]!.value.obj!.loading = true;
        await flushPromises();

        // Assert
        expect(isLoadingValues).eql([true]);
      });

      it("shows the the player as done loading when the MediaTrack responds", async () => {
        // Arrange
        const mediaPlayer = ref(setupPlayer());

        mediaPlayer.value.setQueue([{ id: 1, type: "track" }]);
        await flushPromises();
        MockedMediaTrack.mock.results[0]!.value.obj!.loading = true;
        await flushPromises();

        const isLoadingValues: Boolean[] = [];
        watch(
          () => mediaPlayer.value.isLoading,
          (v) => {
            isLoadingValues.push(v);
          },
        );

        // Act
        MockedMediaTrack.mock.results[0]!.value.obj!.loading = false;
        await flushPromises();

        // Assert
        expect(isLoadingValues).eql([false]);
      });
    });
  });

  describe("Queue integration", () => {
    describe("hasNext", () => {
      it("changes to true if tracks are added to the queue", async () => {
        // Arrange
        const mediaPlayer = ref(setupPlayer());

        const hasNextValues: Boolean[] = [];
        watch(
          () => mediaPlayer.value.hasNext,
          (v) => {
            hasNextValues.push(v);
          },
        );

        // Act
        mediaPlayer.value.setQueue([
          { id: 1, type: "track" },
          { id: 2, type: "track" },
        ]);
        await flushPromises();

        // Assert
        expect(hasNextValues).eql([true]);
      });

      it("doesn't update again when switching to pre-previous track", async () => {
        // Arrange
        const mediaPlayer = ref(setupPlayer());

        mediaPlayer.value.setQueue([
          { id: 1, type: "track" },
          { id: 2, type: "track" },
          { id: 3, type: "track" },
        ]);
        await flushPromises();

        const hasNextValues: Boolean[] = [];
        watch(
          () => mediaPlayer.value.hasNext,
          (v) => {
            hasNextValues.push(v);
          },
        );

        // Act
        mediaPlayer.value.next();
        await flushPromises();

        // Assert
        expect(hasNextValues).eql([]);
      });

      it("changes to false if end of queue is reached", async () => {
        // Arrange
        const mediaPlayer = ref(setupPlayer());

        mediaPlayer.value.setQueue([
          { id: 1, type: "track" },
          { id: 2, type: "track" },
        ]);
        await flushPromises();

        const hasNextValues: Boolean[] = [];
        watch(
          () => mediaPlayer.value.hasNext,
          (v) => {
            hasNextValues.push(v);
          },
        );

        // Act
        mediaPlayer.value.next();
        await flushPromises();

        // Assert
        expect(hasNextValues).eql([false]);
      });

      it("changes to true again if tracks are added after latest playing", async () => {
        // Arrange
        const mediaPlayer = ref(setupPlayer());

        mediaPlayer.value.setQueue(
          [
            { id: 1, type: "track" },
            { id: 2, type: "track" },
          ],
          1,
        );
        await flushPromises();

        const hasNextValues: Boolean[] = [];
        watch(
          () => mediaPlayer.value.hasNext,
          (v) => {
            hasNextValues.push(v);
          },
        );

        // Act
        mediaPlayer.value.addToQueue({ id: 3, type: "track" });
        await flushPromises();

        // Assert
        expect(hasNextValues).eql([true]);
      });

      it("changes to false if the new queue is empty", async () => {
        // Arrange
        const mediaPlayer = ref(setupPlayer());

        mediaPlayer.value.setQueue([
          { id: 1, type: "track" },
          { id: 2, type: "track" },
        ]);
        await flushPromises();

        const hasNextValues: Boolean[] = [];
        watch(
          () => mediaPlayer.value.hasNext,
          (v) => {
            hasNextValues.push(v);
          },
        );

        // Act
        mediaPlayer.value.setQueue([]);
        await flushPromises();

        // Assert
        expect(hasNextValues).eql([false]);
      });
    });

    describe("hasPrevious", () => {
      it("stays true when switching to second track", async () => {
        // Arrange
        const mediaPlayer = ref(setupPlayer());

        mediaPlayer.value.setQueue([
          { id: 1, type: "track" },
          { id: 2, type: "track" },
        ]);
        await flushPromises();

        // Act
        mediaPlayer.value.next();
        await flushPromises();

        // Assert
        expect(mediaPlayer.value.hasPrevious).eql(true);
      });

      it("doesn't update again when switching to third track", async () => {
        // Arrange
        const mediaPlayer = ref(setupPlayer());

        mediaPlayer.value.setQueue([
          { id: 1, type: "track" },
          { id: 2, type: "track" },
          { id: 3, type: "track" },
        ]);
        await flushPromises();
        mediaPlayer.value.next();
        await flushPromises();

        const hasPreviousValues: Boolean[] = [];
        watch(
          () => mediaPlayer.value.hasPrevious,
          (v) => {
            hasPreviousValues.push(v);
          },
        );

        // Act
        mediaPlayer.value.next();
        await flushPromises();

        // Assert
        expect(hasPreviousValues).eql([]);
      });

      it("doesn't change if the index is changed to the beginning of the queue", async () => {
        // Arrange
        const mediaPlayer = ref(setupPlayer());

        mediaPlayer.value.setQueue(
          [
            { id: 1, type: "track" },
            { id: 2, type: "track" },
          ],
          1,
        );
        await flushPromises();

        const hasPreviousValues: Boolean[] = [];
        watch(
          () => mediaPlayer.value.hasPrevious,
          (v) => {
            hasPreviousValues.push(v);
          },
        );

        // Act
        mediaPlayer.value.previous();
        await flushPromises();

        // Assert
        expect(hasPreviousValues).eql([]);
      });

      it("changes to false if the new queue is empty", async () => {
        // Arrange
        const mediaPlayer = ref(setupPlayer());

        mediaPlayer.value.setQueue(
          [
            { id: 1, type: "track" },
            { id: 2, type: "track" },
          ],
          1,
        );
        await flushPromises();

        const hasPreviousValues: Boolean[] = [];
        watch(
          () => mediaPlayer.value.hasPrevious,
          (v) => {
            hasPreviousValues.push(v);
          },
        );

        // Act
        mediaPlayer.value.setQueue([]);
        await flushPromises();

        // Assert
        expect(hasPreviousValues).eql([false]);
      });
    });

    describe("queue", () => {
      it("changes if queue is replaced", async () => {
        // Arrange
        const mediaPlayer = ref(setupPlayer());

        const queueValue: ComputedRef<UnwrapRef<Queue>>[] = [];
        watch(
          () => mediaPlayer.value.queue,
          (v) => {
            queueValue.push(v as any);
          },
        );

        // Act
        mediaPlayer.value.setQueue([
          { id: 1, type: "track" },
          { id: 2, type: "track" },
        ]);
        await flushPromises();
        mediaPlayer.value.setQueue([
          { id: 3, type: "track" },
          { id: 4, type: "track" },
        ]);
        await flushPromises();

        // Assert
        expect(queueValue).length(2);
        expect(queueValue[0]).not.eq(queueValue[1]);
        expect(mediaPlayer.value.queue.currentTrack?.id).not.eq(4);
      });

      it("stopps playing after replacing the queue with an empty queue while playing", async () => {
        // Arrange
        const mediaPlayer = ref(setupPlayer());

        mediaPlayer.value.setQueue(
          [
            { id: 1, type: "track" },
            { id: 2, type: "track" },
          ],
          1,
        );
        await flushPromises();
        MockedMediaTrack.mockClear();

        const currentTracks: (TrackModel | undefined)[] = [];
        watch(
          () => mediaPlayer.value.currentTrack,
          (v) => {
            currentTracks.push(v);
          },
        );

        const statusChanges: MediaPlayerStatus[] = [];
        watch(
          () => mediaPlayer.value.status,
          (v) => {
            statusChanges.push(v);
          },
        );

        // Act
        mediaPlayer.value.setQueue([]);
        await flushPromises();

        // Assert
        expect(destroyMocks).length(1);
        expect(destroyMocks[0]).toHaveBeenCalledOnce();
        expect(MockedMediaTrack).toHaveBeenCalledTimes(0);
        expect(mediaPlayer.value.status).eq(MediaPlayerStatus.Stopped);
        expect(currentTracks).eql([undefined]);
        expect(statusChanges).eql([MediaPlayerStatus.Stopped]);
        expect(mediaPlayer.value.isLoading).eq(false);
        expect(mediaPlayer.value.hasNext).eq(false);
        expect(mediaPlayer.value.hasPrevious).eq(false);
        expect(mediaPlayer.value.queue.length).eq(0);
        expect(mediaPlayer.value.currentTrack).eql(undefined);
        expect(mediaPlayer.value.currentPosition).toBeNaN();
        expect(mediaPlayer.value.currentTrackDuration).toBeNaN();
      });
    });
  });

  describe("inits a new track", () => {
    it("inits a new track start playing a new queue and updates all variables", async () => {
      // Arrange
      const mediaPlayer = ref(setupPlayer());

      const currentTracks: (TrackModel | undefined)[] = [];
      watch(
        () => mediaPlayer.value.currentTrack,
        (v) => {
          currentTracks.push(v);
        },
      );

      const currentPositions: number[] = [];
      watch(
        () => mediaPlayer.value.currentPosition,
        (v) => {
          currentPositions.push(v);
        },
      );

      const currentTrackDurations: number[] = [];
      watch(
        () => mediaPlayer.value.currentTrackDuration,
        (v) => {
          currentTrackDurations.push(v);
        },
      );

      const statusValues: MediaPlayerStatus[] = [];
      watch(
        () => mediaPlayer.value.status,
        (v) => {
          statusValues.push(v);
        },
      );

      // Act
      mediaPlayer.value.setQueue([{ id: 1, type: "track" }]);
      await flushPromises();

      // Assert
      expect(currentTracks).eql([{ id: 1, type: "track" }]);
      expect(currentPositions).eql([0]);
      expect(currentTrackDurations).eql([]); // Value remains NaN
      expect(statusValues).eql([MediaPlayerStatus.Playing]);
    });

    it("updates the length of the track if updated", async () => {
      // Arrange
      const mediaPlayer = ref(setupPlayer());

      mediaPlayer.value.setQueue([{ id: 1, type: "track" }]);
      await flushPromises();

      const currentTrackDurations: number[] = [];
      watch(
        () => mediaPlayer.value.currentTrackDuration,
        (v) => {
          currentTrackDurations.push(v);
        },
      );

      // Act
      MockedMediaTrack.mock.results[0]!.value.obj!.d = 100;
      await flushPromises();
      MockedMediaTrack.mock.results[0]!.value.obj!.d = 102; // Late update
      await flushPromises();

      // Assert
      expect(currentTrackDurations).eql([100, 102]);
    });
  });

  describe("finish playing a track", () => {
    it("inits a new track when finished playing and updates all variables", async () => {
      // Arrange
      const mediaPlayer = ref(setupPlayer());

      mediaPlayer.value.setQueue([
        { id: 1, type: "track" },
        { id: 2, type: "track" },
      ]);
      await flushPromises();

      MockedMediaTrack.mock.results[0]!.value.obj!.position = 100;
      MockedMediaTrack.mock.results[0]!.value.obj!.d = 100;
      await flushPromises();

      const currentTracks: (TrackModel | undefined)[] = [];
      watch(
        () => mediaPlayer.value.currentTrack,
        (v) => {
          currentTracks.push(v);
        },
      );

      const currentPositions: number[] = [];
      watch(
        () => mediaPlayer.value.currentPosition,
        (v) => {
          currentPositions.push(v);
        },
      );

      const currentTrackDurations: number[] = [];
      watch(
        () => mediaPlayer.value.currentTrackDuration,
        (v) => {
          currentTrackDurations.push(v);
        },
      );

      const statusValues: MediaPlayerStatus[] = [];
      watch(
        () => mediaPlayer.value.status,
        (v) => {
          statusValues.push(v);
        },
      );

      // Act
      MockedMediaTrack.mock.results[0]!.value.obj!.ended = true;
      await flushPromises();

      // Assert
      expect(currentTracks).eql([{ id: 2, type: "track" }]);
      expect(currentPositions).eql([0]);
      expect(currentTrackDurations).eql([NaN]);
      expect(statusValues).eql([]); // Status doesn't change because we remain playing
    });

    it("stopps when finished playing without having a next track and updates all variables", async () => {
      // Arrange
      const mediaPlayer = ref(setupPlayer());

      mediaPlayer.value.setQueue([{ id: 1, type: "track" }]);
      await flushPromises();

      MockedMediaTrack.mock.results[0]!.value.obj!.position = 100;
      MockedMediaTrack.mock.results[0]!.value.obj!.d = 100;
      await flushPromises();

      const currentTracks: (TrackModel | undefined)[] = [];
      watch(
        () => mediaPlayer.value.currentTrack,
        (v) => {
          currentTracks.push(v);
        },
      );

      const currentPositions: number[] = [];
      watch(
        () => mediaPlayer.value.currentPosition,
        (v) => {
          currentPositions.push(v);
        },
      );

      const currentTrackDurations: number[] = [];
      watch(
        () => mediaPlayer.value.currentTrackDuration,
        (v) => {
          currentTrackDurations.push(v);
        },
      );

      const statusValues: MediaPlayerStatus[] = [];
      watch(
        () => mediaPlayer.value.status,
        (v) => {
          statusValues.push(v);
        },
      );

      // Act
      MockedMediaTrack.mock.results[0]!.value.obj!.ended = true;
      await flushPromises();

      // Assert
      expect(currentTracks).eql([]); // Doesn't reset but still has this as current
      expect(currentPositions).eql([NaN]);
      expect(currentTrackDurations).eql([NaN]);
      expect(statusValues).eql([MediaPlayerStatus.Stopped]);
    });
  });
});
