// @vitest-environment happy-dom

import { PlaylistApi } from "@bcc-code/bmm-sdk-fetch";
import { describe, it, expect, vi, afterEach } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import * as auth0 from "@auth0/auth0-vue";
import PlaylistOverview from "./PlaylistOverview.vue";

vi.mock("@auth0/auth0-vue");

describe("component PlaylistOverview", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should list the playlists in the order given by the api", async () => {
    // Arrange
    (auth0 as any).useAuth0.mockReturnValue({
      getAccessTokenSilently: () => Promise.resolve("testToken"),
    });

    vi.spyOn(PlaylistApi.prototype, "playlistGet").mockResolvedValue([
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
    ]);

    // Act
    const wrapper = mount(PlaylistOverview);
    await flushPromises();

    // Assert
    expect(wrapper.text()).matches(
      /TestSamplePlaylist1.*TestSamplePlaylist2.*TestSamplePlaylist3/
    );
  });
});
