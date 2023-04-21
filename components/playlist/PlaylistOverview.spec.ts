// @vitest-environment happy-dom

import { PlaylistApi } from "@bcc-code/bmm-sdk-fetch";
import { describe, it, expect, vi, afterEach } from "vitest";
import { RouterLinkStub, flushPromises, mount } from "@vue/test-utils";
import { setup } from "@nuxt/test-utils";
import PlaylistOverview from "./PlaylistOverview.vue";

describe("component PlaylistOverview", async () => {
  await setup({});

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should list the playlists in the order given by the api", async () => {
    // Arrange
    vi.spyOn(PlaylistApi.prototype, "playlistGet").mockReturnValueOnce(
      Promise.resolve([
        {
          id: 10,
          title: "TestSamplePlaylist1",
        },
        {
          id: 12,
          title: "TestSamplePlaylist2",
        },
        {
          id: 11,
          title: "TestSamplePlaylist3",
        },
      ])
    );

    // Act
    const wrapper = mount(PlaylistOverview, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    await flushPromises();

    // Assert
    expect(wrapper.text()).matches(
      /TestSamplePlaylist1.*TestSamplePlaylist2.*TestSamplePlaylist3/
    );
  });
});
