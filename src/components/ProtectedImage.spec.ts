// @vitest-environment happy-dom

import { describe, it, expect, vi, afterEach } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import ProtectedImage from "./ProtectedImage.vue";

describe("component ProtectedImage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should list the playlists in the order given by the api", async () => {
    // Arrange
    vi.mock("@auth0/auth0-vue", () => ({
      useAuth0: () => ({ getAccessTokenSilently: () => Promise.resolve(null) }),
    }));

    const src = "http://localhost/image.jpg";

    // Act
    const wrapper = mount(ProtectedImage, {
      props: {
        src,
      },
    });
    await flushPromises();

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const el = wrapper.element as HTMLImageElement;

    // Assert
    expect(el.src).matches(/http:\/\/localhost\/image\.jpg/);
  });
});
