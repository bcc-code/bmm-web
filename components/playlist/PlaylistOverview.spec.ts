// @vitest-environment happy-dom

import { PlaylistModel } from "@bcc-code/bmm-sdk-fetch";
import { describe, it, expect } from "vitest";
import { RouterLinkStub, flushPromises, mount } from "@vue/test-utils";
import PlaylistOverview from "./PlaylistOverview.vue";

describe("component PlaylistOverview", () => {
  it("should list the playlists in the order given by the api", async () => {
    // Arrange
    const playlists: PlaylistModel[] = [
      {
        id: 10,
        type: "playlist",
        title: "TestSamplePlaylist1",
      },
      {
        id: 12,
        type: "playlist",
        title: "TestSamplePlaylist2",
      },
      {
        id: 11,
        type: "playlist",
        title: "TestSamplePlaylist3",
      },
    ];

    // Act
    const wrapper = mount(PlaylistOverview, {
      props: {
        playlists,
      },
      global: { stubs: { NuxtLink: RouterLinkStub } },
    });
    await flushPromises();

    // Assert
    expect(wrapper.text()).matches(
      /TestSamplePlaylist1.*TestSamplePlaylist2.*TestSamplePlaylist3/
    );
  });
});
