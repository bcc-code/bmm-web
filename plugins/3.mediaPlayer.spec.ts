// @vitest-environment happy-dom

import { describe, it, expect, vi, SpyInstance } from "vitest";
import { flushPromises } from "@vue/test-utils";
import { HTMLAudioElement, Event } from "happy-dom";
import { TrackModel } from "@bcc-code/bmm-sdk-fetch";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { MediaPlayerStatus, initMediaPlayer } from "./3.mediaPlayer";

describe("plugin mediaPlayer", () => {
  const appInsights = {
    trackEvent: vi.fn(),
  } as unknown as ApplicationInsights;

  it("inits stopped with an empty queue", () => {
    // Arrange
    const mediaPlayer = initMediaPlayer(
      () => new HTMLAudioElement() as unknown as globalThis.HTMLAudioElement,
      appInsights
    );

    // Assert
    expect(mediaPlayer.queue.value).length(0);
    expect(mediaPlayer.queue.value.currentTrack).equals(undefined);
    expect(mediaPlayer.currentTrack.value).equals(undefined);
    expect(mediaPlayer.status.value).equals(MediaPlayerStatus.Stopped);
  });

  it("sets a queue with tracks and starts playing from the start", async () => {
    // Arrange
    const audioElements: HTMLAudioElement[] = [];
    const mediaPlayer = initMediaPlayer(() => {
      const el = new HTMLAudioElement();

      audioElements.push(el);
      return el as unknown as globalThis.HTMLAudioElement;
    }, appInsights);

    // Act
    mediaPlayer.setQueue([
      {
        id: 5,
        type: "track",
      },
      {
        id: 2,
        type: "track",
      },
      {
        id: 9,
        type: "track",
      },
    ]);
    await flushPromises();

    // Assert
    expect(mediaPlayer.currentPosition.value).equals(0);
    expect(mediaPlayer.queue.value).length(3);
    expect(mediaPlayer.queue.value[0]?.id).equals(5);
    expect(mediaPlayer.queue.value.currentTrack?.id).equals(5);
    expect(mediaPlayer.currentTrack.value?.id).equals(5);
    expect(audioElements).length(1);
    expect(audioElements[0]?.autoplay).equals(true);
    expect(mediaPlayer.status.value).equals(MediaPlayerStatus.Playing);
  });

  it("clones the list set as queue", async () => {
    // Arrange
    const mediaPlayer = initMediaPlayer(
      () => new HTMLAudioElement() as unknown as globalThis.HTMLAudioElement,
      appInsights
    );

    // Act
    const queue: TrackModel[] = [
      {
        id: 5,
        type: "track",
      },
      {
        id: 2,
        type: "track",
      },
      {
        id: 9,
        type: "track",
      },
    ];
    mediaPlayer.setQueue(queue);
    await flushPromises();
    queue.pop();
    await flushPromises();

    // Assert
    expect(mediaPlayer.queue.value).length(3);
  });

  it("adds tracks in the right order and clones them before adding - needed for shuffling when currently playing item is in the list twice", async () => {
    // Arrange
    const mediaPlayer = initMediaPlayer(
      () => new HTMLAudioElement() as unknown as globalThis.HTMLAudioElement,
      appInsights
    );

    // Act
    const track1: TrackModel = {
      id: 5,
      type: "track",
    };
    const track2: TrackModel = {
      id: 2,
      type: "track",
    };
    mediaPlayer.addToQueue(track1);
    await flushPromises();
    mediaPlayer.addToQueue(track1);
    await flushPromises();
    mediaPlayer.playNext(track2);
    await flushPromises();
    mediaPlayer.playNext(track2);
    await flushPromises();

    /* The list we should have is:
     * Track 5 (playing)
     * Track 2
     * Track 2
     * Track 5
     */ //

    // Assert
    expect(mediaPlayer.queue.value).length(4);
    expect(mediaPlayer.queue.value[0]?.id).eq(5);
    expect(mediaPlayer.queue.value[0]).not.eq(mediaPlayer.queue.value[3]);
    expect(mediaPlayer.queue.value[1]?.id).eq(2);
    expect(mediaPlayer.queue.value[1]).not.eq(mediaPlayer.queue.value[2]);
  });

  it("continues to the next track if ended", async () => {
    // Arrange
    const audioElements: HTMLAudioElement[] = [];
    const mediaPlayer = initMediaPlayer(() => {
      const el = new HTMLAudioElement();

      audioElements.push(el);
      return el as unknown as globalThis.HTMLAudioElement;
    }, appInsights);

    // Act
    mediaPlayer.setQueue([
      {
        id: 5,
        type: "track",
      },
      {
        id: 2,
        type: "track",
      },
      {
        id: 9,
        type: "track",
      },
    ]);
    await flushPromises();
    audioElements[0]?.dispatchEvent(
      new Event("ended", { bubbles: false, cancelable: false })
    );
    await flushPromises();

    // Assert
    expect(mediaPlayer.queue.value.currentTrack?.id).equals(2);
    expect(mediaPlayer.currentTrack.value?.id).equals(2);
    expect(audioElements).length(2);
    expect(audioElements[1]?.autoplay).equals(true);
    expect(mediaPlayer.status.value).equals(MediaPlayerStatus.Playing);
  });

  it("jumps to next track if `next` action is called", async () => {
    const audioElements: HTMLAudioElement[] = [];
    const mediaPlayer = initMediaPlayer(() => {
      const el = new HTMLAudioElement();

      audioElements.push(el);
      return el as unknown as globalThis.HTMLAudioElement;
    }, appInsights);

    // Act
    mediaPlayer.setQueue([
      {
        id: 5,
        type: "track",
      },
      {
        id: 2,
        type: "track",
      },
    ]);
    await flushPromises();
    mediaPlayer.next();
    await flushPromises();

    // Assert
    expect(mediaPlayer.queue.value.currentTrack?.id).equals(2);
    expect(mediaPlayer.currentTrack.value?.id).equals(2);
    expect(audioElements).length(2);
    expect(audioElements[1]?.autoplay).equals(true);
    expect(mediaPlayer.status.value).equals(MediaPlayerStatus.Playing);
  });

  it("ignores the `next` action if there is no next track", async () => {
    const audioElements: HTMLAudioElement[] = [];
    const mediaPlayer = initMediaPlayer(() => {
      const el = new HTMLAudioElement();

      audioElements.push(el);
      return el as unknown as globalThis.HTMLAudioElement;
    }, appInsights);

    // Act
    mediaPlayer.setQueue([
      {
        id: 5,
        type: "track",
      },
    ]);
    await flushPromises();
    mediaPlayer.next();
    await flushPromises();

    // Assert
    expect(mediaPlayer.queue.value.currentTrack?.id).equals(5);
    expect(mediaPlayer.currentTrack.value?.id).equals(5);
    expect(audioElements).length(1);
    expect(mediaPlayer.status.value).equals(MediaPlayerStatus.Playing);
  });

  it("jumps to previous track if `previous` action is called", async () => {
    const audioElements: HTMLAudioElement[] = [];
    const mediaPlayer = initMediaPlayer(() => {
      const el = new HTMLAudioElement();

      audioElements.push(el);
      return el as unknown as globalThis.HTMLAudioElement;
    }, appInsights);

    // Act
    mediaPlayer.setQueue(
      [
        {
          id: 5,
          type: "track",
        },
        {
          id: 2,
          type: "track",
        },
      ],
      1
    );
    await flushPromises();
    mediaPlayer.previous();
    await flushPromises();

    // Assert
    expect(mediaPlayer.queue.value.currentTrack?.id).equals(5);
    expect(mediaPlayer.currentTrack.value?.id).equals(5);
    expect(audioElements).length(2);
    expect(audioElements[1]?.autoplay).equals(true);
    expect(mediaPlayer.status.value).equals(MediaPlayerStatus.Playing);
  });

  it("ignores the `previous` action if there is no previous track", async () => {
    const audioElements: HTMLAudioElement[] = [];
    const mediaPlayer = initMediaPlayer(() => {
      const el = new HTMLAudioElement();

      audioElements.push(el);
      return el as unknown as globalThis.HTMLAudioElement;
    }, appInsights);

    // Act
    mediaPlayer.setQueue(
      [
        {
          id: 5,
          type: "track",
        },
      ],
      0
    );
    await flushPromises();
    mediaPlayer.previous();
    await flushPromises();

    // Assert
    expect(mediaPlayer.queue.value.currentTrack?.id).equals(5);
    expect(mediaPlayer.currentTrack.value?.id).equals(5);
    expect(audioElements).length(1);
    expect(mediaPlayer.status.value).equals(MediaPlayerStatus.Playing);
  });

  it("sets index on setQueue to maximum-value if greater than queue", async () => {
    const audioElements: HTMLAudioElement[] = [];
    const mediaPlayer = initMediaPlayer(() => {
      const el = new HTMLAudioElement();

      audioElements.push(el);
      return el as unknown as globalThis.HTMLAudioElement;
    }, appInsights);

    // Act
    mediaPlayer.setQueue(
      [
        {
          id: 5,
          type: "track",
        },
      ],
      999 // Index is way too large!
    );
    await flushPromises();

    // Assert
    expect(mediaPlayer.queue.value.currentTrack?.id).equals(5);
    expect(mediaPlayer.currentTrack.value?.id).equals(5);
  });

  it("sets index on queue to maximum-value if greater than queue", async () => {
    const audioElements: HTMLAudioElement[] = [];
    const mediaPlayer = initMediaPlayer(() => {
      const el = new HTMLAudioElement();

      audioElements.push(el);
      return el as unknown as globalThis.HTMLAudioElement;
    }, appInsights);

    // Act
    mediaPlayer.setQueue(
      [
        {
          id: 5,
          type: "track",
        },
      ],
      0
    );
    await flushPromises();
    mediaPlayer.queue.value.index = 999; // Index is way too large!
    await flushPromises();

    // Assert
    expect(mediaPlayer.queue.value.currentTrack?.id).equals(5);
    expect(mediaPlayer.currentTrack.value?.id).equals(5);
  });

  it("sets index on queue to 0 if negative", async () => {
    const audioElements: HTMLAudioElement[] = [];
    const mediaPlayer = initMediaPlayer(() => {
      const el = new HTMLAudioElement();

      audioElements.push(el);
      return el as unknown as globalThis.HTMLAudioElement;
    }, appInsights);

    // Act
    mediaPlayer.setQueue(
      [
        {
          id: 5,
          type: "track",
        },
        {
          id: 2,
          type: "track",
        },
      ],
      1
    );
    await flushPromises();
    mediaPlayer.queue.value.index = -999; // Index is negative!
    await flushPromises();

    // Assert
    expect(mediaPlayer.queue.value.currentTrack?.id).equals(5);
    expect(mediaPlayer.currentTrack.value?.id).equals(5);
  });

  it("adds a track to queue and starts playing", async () => {
    // Arrange
    const audioElements: HTMLAudioElement[] = [];
    const mediaPlayer = initMediaPlayer(() => {
      const el = new HTMLAudioElement();

      audioElements.push(el);
      return el as unknown as globalThis.HTMLAudioElement;
    }, appInsights);

    // Act
    mediaPlayer.addToQueue({
      id: 5,
      type: "track",
    });
    await flushPromises();

    // Assert
    expect(mediaPlayer.currentPosition.value).equals(0);
    expect(mediaPlayer.queue.value).length(1);
    expect(mediaPlayer.queue.value[0]?.id).equals(5);
    expect(mediaPlayer.queue.value.currentTrack?.id).equals(5);
    expect(mediaPlayer.queue.value.index).equals(0);
    expect(mediaPlayer.currentTrack.value?.id).equals(5);
    expect(audioElements).length(1);
    expect(audioElements[0]?.autoplay).equals(true);
    expect(mediaPlayer.status.value).equals(MediaPlayerStatus.Playing);
  });

  it("remains stopped with an empty queue when queue is set to an empty array", async () => {
    // Arrange
    const mediaPlayer = initMediaPlayer(
      () => new HTMLAudioElement() as unknown as globalThis.HTMLAudioElement,
      appInsights
    );

    // Act
    mediaPlayer.addToQueue({
      id: 5,
      type: "track",
    });
    await flushPromises();
    mediaPlayer.setQueue([]);
    await flushPromises();

    // Assert
    expect(mediaPlayer.queue.value).length(0);
    expect(mediaPlayer.queue.value.index).equals(-1);
    expect(mediaPlayer.queue.value.currentTrack).equals(undefined);
    expect(mediaPlayer.currentTrack.value).equals(undefined);
    expect(mediaPlayer.status.value).equals(MediaPlayerStatus.Stopped);
  });

  it("pauses the playing media and updates status if pause-action is triggered.", async () => {
    // Arrange
    const audioElements: HTMLAudioElement[] = [];
    let spy: SpyInstance<[], void> | undefined;
    const mediaPlayer = initMediaPlayer(() => {
      const el = new HTMLAudioElement();
      spy = vi.spyOn(el, "pause");

      audioElements.push(el);
      return el as unknown as globalThis.HTMLAudioElement;
    }, appInsights);

    // Act
    mediaPlayer.setQueue([
      {
        id: 5,
        type: "track",
      },
    ]);
    await flushPromises();
    mediaPlayer.pause();

    // Assert
    expect(mediaPlayer.status.value).equals(MediaPlayerStatus.Paused);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("resumes the playing media and updates status if play-action is triggered on paused track", async () => {
    // Arrange
    const audioElements: HTMLAudioElement[] = [];
    let spy: SpyInstance<[], Promise<void>> | undefined;
    const mediaPlayer = initMediaPlayer(() => {
      const el = new HTMLAudioElement();
      spy = vi.spyOn(el, "play");

      audioElements.push(el);
      return el as unknown as globalThis.HTMLAudioElement;
    }, appInsights);

    // Act
    mediaPlayer.addToQueue({
      id: 5,
      type: "track",
    });
    await flushPromises();
    mediaPlayer.pause();
    await flushPromises();
    mediaPlayer.play();
    audioElements[0]?.dispatchEvent(
      new Event("play", { bubbles: false, cancelable: false })
    );
    await flushPromises();

    // Assert
    expect(mediaPlayer.status.value).equals(MediaPlayerStatus.Playing);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("starts playing the track on index if index is changed and playing is paused", async () => {
    // Arrange
    const audioElements: HTMLAudioElement[] = [];
    let spy: SpyInstance<[], Promise<void>> | undefined;
    const mediaPlayer = initMediaPlayer(() => {
      const el = new HTMLAudioElement();
      spy = vi.spyOn(el, "play");

      audioElements.push(el);
      return el as unknown as globalThis.HTMLAudioElement;
    }, appInsights);

    // Act
    mediaPlayer.setQueue([
      {
        id: 5,
        type: "track",
      },
      {
        id: 2,
        type: "track",
      },
      {
        id: 9,
        type: "track",
      },
    ]);
    await flushPromises();
    mediaPlayer.pause();
    await flushPromises();
    mediaPlayer.queue.value.index = 1;
    await flushPromises();

    // Assert
    expect(mediaPlayer.status.value).equals(MediaPlayerStatus.Playing);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it(
    "shuffles the elements on the queue if method is called",
    () => {
      // Arrange
      const mediaPlayer = initMediaPlayer(
        () => new HTMLAudioElement() as unknown as globalThis.HTMLAudioElement,
        appInsights
      );

      // Act
      mediaPlayer.setQueue(
        new Array(50).fill(0).map((_, i) => ({
          id: i,
          type: "track",
        }))
      );
      mediaPlayer.queue.value.shuffle();

      // Assert
      expect(mediaPlayer.queue.value[2]?.id).not.eq(2);
    },
    { retry: 100 }
  );

  it(
    "unshuffles the elements on the queue if method is called after shuffling",
    () => {
      // Arrange
      const mediaPlayer = initMediaPlayer(
        () => new HTMLAudioElement() as unknown as globalThis.HTMLAudioElement,
        appInsights
      );

      // Act
      mediaPlayer.setQueue(
        new Array(50).fill(0).map((_, i) => ({
          id: i,
          type: "track",
        }))
      );
      mediaPlayer.queue.value.shuffle();
      mediaPlayer.queue.value.unshuffle();

      // Assert
      expect(mediaPlayer.queue.value[2]?.id).eq(2);
    },
    { repeats: 100 }
  );

  it("changes index on shuffling without triggering a new track to play", async () => {
    // Arrange
    const returnValue = vi.fn(
      () => new HTMLAudioElement() as unknown as globalThis.HTMLAudioElement
    );
    const mediaPlayer = initMediaPlayer(() => returnValue(), appInsights);

    // Act
    mediaPlayer.setQueue(
      new Array(50).fill(0).map((_, i) => ({
        id: i,
        type: "track",
      })),
      20
    );
    await flushPromises();

    // Assert
    mediaPlayer.queue.value.shuffle();
    await flushPromises();
    mediaPlayer.queue.value.unshuffle();
    await flushPromises();

    expect(returnValue).toHaveBeenCalledOnce();
  });

  it("updates the the current position if media triggers `timeupdate`", async () => {
    const audioElements: HTMLAudioElement[] = [];
    const mediaPlayer = initMediaPlayer(() => {
      const el = new HTMLAudioElement();

      audioElements.push(el);
      return el as unknown as globalThis.HTMLAudioElement;
    }, appInsights);

    // Act
    mediaPlayer.setQueue([
      {
        id: 5,
        type: "track",
      },
      {
        id: 2,
        type: "track",
      },
      {
        id: 9,
        type: "track",
      },
    ]);
    await flushPromises();
    audioElements[0]!.currentTime = 500;
    audioElements[0]!.dispatchEvent(
      new Event("timeupdate", { bubbles: false, cancelable: false })
    );
    await flushPromises();

    // Assert
    expect(mediaPlayer.currentPosition.value).equals(500);
  });

  it("updates the media item when the user seeks", async () => {
    const audioElements: HTMLAudioElement[] = [];
    const mediaPlayer = initMediaPlayer(() => {
      const el = new HTMLAudioElement();

      audioElements.push(el);
      return el as unknown as globalThis.HTMLAudioElement;
    }, appInsights);

    // Act
    mediaPlayer.setQueue([
      {
        id: 5,
        type: "track",
      },
      {
        id: 2,
        type: "track",
      },
      {
        id: 9,
        type: "track",
      },
    ]);
    await flushPromises();
    mediaPlayer.currentPosition.value = 500;
    await flushPromises();

    // Assert
    expect(audioElements[0]!.currentTime).equals(500);
  });

  it("resets all values when calling `stop`", async () => {
    const audioElements: HTMLAudioElement[] = [];
    const mediaPlayer = initMediaPlayer(() => {
      const el = new HTMLAudioElement();

      audioElements.push(el);
      return el as unknown as globalThis.HTMLAudioElement;
    }, appInsights);

    // Act
    mediaPlayer.setQueue(
      [
        {
          id: 5,
          type: "track",
        },
        {
          id: 2,
          type: "track",
        },
      ],
      1
    );
    await flushPromises();
    mediaPlayer.stop();
    await flushPromises();

    // Assert
    expect(mediaPlayer.queue.value).length(2);
    expect(mediaPlayer.queue.value.currentTrack?.id).equals(2);
    expect(mediaPlayer.currentTrack.value?.id).equals(2);
    expect(mediaPlayer.status.value).equals(MediaPlayerStatus.Stopped);
  });

  it("start playing when calling `play` after `stop`", async () => {
    const audioElements: HTMLAudioElement[] = [];
    const mediaPlayer = initMediaPlayer(() => {
      const el = new HTMLAudioElement();

      audioElements.push(el);
      return el as unknown as globalThis.HTMLAudioElement;
    }, appInsights);

    // Act
    mediaPlayer.setQueue(
      [
        {
          id: 5,
          type: "track",
        },
        {
          id: 2,
          type: "track",
        },
      ],
      1
    );
    await flushPromises();
    mediaPlayer.stop();
    await flushPromises();
    mediaPlayer.play();
    await flushPromises();

    // Assert
    expect(mediaPlayer.queue.value).length(2);
    expect(mediaPlayer.queue.value.currentTrack?.id).equals(2);
    expect(mediaPlayer.currentTrack.value?.id).equals(2);
    expect(mediaPlayer.status.value).equals(MediaPlayerStatus.Playing);
    expect(audioElements).length(2);
  });
});
