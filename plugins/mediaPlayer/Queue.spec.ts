// @vitest-environment happy-dom

import { describe, it, expect } from "vitest";
import { flushPromises } from "@vue/test-utils";
import type { TrackModel } from "@bcc-code/bmm-sdk-fetch";
import Queue from "./Queue";
import EnrichedTrackModel from "./EnrichedTrackModel";

const now = new Date();
function track(id: number) {
  const t: TrackModel = {
    id,
    type: "track",
    parentId: 123,
    publishedAt: now,
    recordedAt: now,
    tags: [],
    subtype: "song",
    language: "nb",
    languages: ["nb"],
    transcriptionLanguages: [],
    meta: {},
  };
  return new EnrichedTrackModel(t, "");
}

describe("plugin mediaPlayer Queue", () => {
  describe("init", () => {
    it("is unshuffled and has an index of -1 on empty initialization", () => {
      // Act
      const q = new Queue();

      // Assert
      expect(q.isShuffled).equal(false);
      expect(q.index).equal(-1);
      expect(q.currentTrack).toBeUndefined();
    });

    it("still is unshuffled and has an index of -1 on empty initialization with index lower than -1", () => {
      // Act
      const q = new Queue([], -99);

      // Assert
      expect(q.isShuffled).equal(false);
      expect(q.index).equal(-1);
      expect(q.currentTrack).toBeUndefined();
    });

    it("still is unshuffled and has an index of -1 on empty initialization with index higher than -1", () => {
      // Act
      let q = new Queue([], 0);

      // Assert
      expect(q.isShuffled).equal(false);
      expect(q.index).equal(-1);
      expect(q.currentTrack).toBeUndefined();

      // Act
      q = new Queue([], 99);

      // Assert
      expect(q.isShuffled).equal(false);
      expect(q.index).equal(-1);
      expect(q.currentTrack).toBeUndefined();
    });

    it("is unshuffled and has an index of 0 on non-empty initialization", () => {
      // Act
      const q = new Queue([track(1), track(2), track(3)]);

      // Assert
      expect(q.isShuffled).equal(false);
      expect(q.index).equal(0);
      expect(q.currentTrack).toBeDefined();
      expect(q.currentTrack!.track.id).equal(1);
    });

    it("is unshuffled and has an index of 1 on non-empty initialization with index of 1", () => {
      // Act
      const q = new Queue([track(1), track(2), track(3)], 1);

      // Assert
      expect(q.isShuffled).equal(false);
      expect(q.index).equal(1);
      expect(q.currentTrack).toBeDefined();
      expect(q.currentTrack!.track.id).equal(2);
    });

    it("is unshuffled and has an index of 0 on non-empty initialization with index of -99", () => {
      // Act
      const q = new Queue([track(1), track(2), track(3)], -99);

      // Assert
      expect(q.isShuffled).equal(false);
      expect(q.index).equal(0);
      expect(q.currentTrack).toBeDefined();
      expect(q.currentTrack!.track.id).equal(1);
    });

    it("is unshuffled and has an index of the highest element on non-empty initialization with index of 99 (too high)", () => {
      // Act
      const q = new Queue([track(1), track(2), track(3)], 99);

      // Assert
      expect(q.isShuffled).equal(false);
      expect(q.index).equal(2);
      expect(q.currentTrack).toBeDefined();
      expect(q.currentTrack!.track.id).equal(3);
    });
  });

  describe("shuffling", () => {
    it(
      "shuffles the elements if method `shuffle` is called and sets isShuffled to `true`",
      { retry: 100 },
      () => {
        // Arrange
        const q = new Queue(new Array(50).fill(0).map((_, i) => track(i)));

        // Act
        q.shuffle();

        // Assert
        expect(q[2]?.track.id).not.eq(2);
        expect(q.isShuffled).eq(true);
      },
    );

    it(
      "unshuffles the elements if method `unshuffle` is called after shuffling and sets isShuffled to `false`",
      { repeats: 100 },
      () => {
        // Arrange
        const q = new Queue(new Array(50).fill(0).map((_, i) => track(i)));

        // Act
        q.shuffle();
        q.unshuffle();

        // Assert
        expect(q[2]?.track.id).eq(2);
        expect(q.isShuffled).eq(false);
      },
    );

    it("changes index of the current track on shuffling without triggering a change of the track", async () => {
      // Arrange
      const qObject = ref<Queue | undefined>();

      const indexes: (number | undefined)[] = [];
      watch(
        () => qObject.value?.index,
        (v) => {
          indexes.push(v);
        },
      );
      const tracks: (EnrichedTrackModel | undefined)[] = [];
      watch(
        () => qObject.value?.currentTrack,
        (v) => {
          tracks.push(v);
        },
      );

      qObject.value = new Queue(
        new Array(50).fill(0).map((_, i) => track(i)),
        20,
      );

      // Act
      await flushPromises();
      qObject.value.shuffle();
      await flushPromises();
      qObject.value.unshuffle();
      await flushPromises();

      // Assert
      expect(indexes).eql([20, 0, 20]);
      expect(tracks).eql([track(20)]);
    });
  });

  describe("index", () => {
    it("updates the current track and index if it is changed within the range", async () => {
      // Arrange
      const qObject = ref<Queue | undefined>();

      const indexes: (number | undefined)[] = [];
      watch(
        () => qObject.value?.index,
        (v) => {
          indexes.push(v);
        },
      );
      const tracks: (EnrichedTrackModel | undefined)[] = [];
      watch(
        () => qObject.value?.currentTrack,
        (v) => {
          tracks.push(v);
        },
      );

      qObject.value = new Queue(
        new Array(50).fill(0).map((_, i) => track(i)),
        20,
      );

      // Act
      await flushPromises();
      qObject.value.index = 10;
      await flushPromises();

      // Assert
      expect(indexes).eql([20, 10]);
      expect(tracks).eql([track(20), track(10)]);
    });

    it("updates the current track and index to first track if it is changed below the range", async () => {
      // Arrange
      const qObject = ref<Queue | undefined>();

      const indexes: (number | undefined)[] = [];
      watch(
        () => qObject.value?.index,
        (v) => {
          indexes.push(v);
        },
      );
      const tracks: (EnrichedTrackModel | undefined)[] = [];
      watch(
        () => qObject.value?.currentTrack,
        (v) => {
          tracks.push(v);
        },
      );

      qObject.value = new Queue(
        new Array(50).fill(0).map((_, i) => track(i)),
        20,
      );

      // Act
      await flushPromises();
      qObject.value.index = -99;
      await flushPromises();

      // Assert
      expect(indexes).eql([20, 0]);
      expect(tracks).eql([track(20), track(0)]);
    });

    it("updates the current track and index to last track if it is changed above the range", async () => {
      // Arrange
      const qObject = ref<Queue | undefined>();

      const indexes: (number | undefined)[] = [];
      watch(
        () => qObject.value?.index,
        (v) => {
          indexes.push(v);
        },
      );
      const tracks: (EnrichedTrackModel | undefined)[] = [];
      watch(
        () => qObject.value?.currentTrack,
        (v) => {
          tracks.push(v);
        },
      );

      qObject.value = new Queue(
        new Array(50).fill(0).map((_, i) => track(i)),
        20,
      );

      // Act
      await flushPromises();
      qObject.value.index = 99;
      await flushPromises();

      // Assert
      expect(indexes).eql([20, 49]);
      expect(tracks).eql([track(20), track(49)]);
    });

    it("doesn't the current track and index if index is changed below the range while on first", async () => {
      // Arrange
      const qObject = ref<Queue | undefined>();

      const indexes: (number | undefined)[] = [];
      watch(
        () => qObject.value?.index,
        (v) => {
          indexes.push(v);
        },
      );
      const tracks: (EnrichedTrackModel | undefined)[] = [];
      watch(
        () => qObject.value?.currentTrack,
        (v) => {
          tracks.push(v);
        },
      );

      qObject.value = new Queue(
        new Array(50).fill(0).map((_, i) => track(i)),
        0,
      );

      // Act
      await flushPromises();
      qObject.value.index = -99;
      await flushPromises();

      // Assert
      expect(indexes).eql([0]);
      expect(tracks).eql([track(0)]);
    });

    it("doesn't the current track and index if index is changed above the range while on last", async () => {
      // Arrange
      const qObject = ref<Queue | undefined>();

      const indexes: (number | undefined)[] = [];
      watch(
        () => qObject.value?.index,
        (v) => {
          indexes.push(v);
        },
      );
      const tracks: (EnrichedTrackModel | undefined)[] = [];
      watch(
        () => qObject.value?.currentTrack,
        (v) => {
          tracks.push(v);
        },
      );

      qObject.value = new Queue(
        new Array(50).fill(0).map((_, i) => track(i)),
        49,
      );

      // Act
      await flushPromises();
      qObject.value.index = 99;
      await flushPromises();

      // Assert
      expect(indexes).eql([49]);
      expect(tracks).eql([track(49)]);
    });
  });

  describe("reordering", () => {
    it("can reorder the queue", async () => {
      // Arrange
      const qObject = ref<Queue | undefined>();
      const indexes: (number | undefined)[] = [];

      watch(
        () => qObject.value?.index,
        (v) => {
          indexes.push(v);
        },
      );

      qObject.value = new Queue(
        new Array(10).fill(0).map((_, i) => track(i)),
        0,
      );

      // Act
      await flushPromises();
      const t = qObject.value.at(0);
      await flushPromises();
      qObject.value.moveTrack(0, 3);
      await flushPromises();

      // Assert
      expect(indexes).eql([0, 3]);
      expect(qObject.value.at(3)).eql(t);
    });

    it("reordering doesn't change the current track", async () => {
      // Arrange
      const qObject = ref<Queue | undefined>();
      const changes: (EnrichedTrackModel | undefined)[] = [];

      qObject.value = new Queue(
        new Array(10).fill(0).map((_, i) => track(i)),
        0,
      );

      watch(
        () => qObject.value?.currentTrack,
        (v) => {
          changes.push(v);
        },
      );

      // Act
      await flushPromises();
      qObject.value.moveTrack(0, 3);
      await flushPromises();

      // Assert
      expect(changes.length).eql(0);
    });
  });
});
