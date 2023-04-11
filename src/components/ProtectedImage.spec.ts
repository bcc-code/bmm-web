// @vitest-environment happy-dom

import { describe, it, expect, vi, afterEach } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import * as auth0 from "@auth0/auth0-vue";
import ProtectedImage from "./ProtectedImage.vue";

describe("component ProtectedImage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should add the access token to the given path", async () => {
    // Arrange
    vi.spyOn(auth0, "useAuth0").mockReturnValueOnce({
      getAccessTokenSilently: (o) => {
        if (o?.detailedResponse)
          return {
            id_token: "",
            access_token: "MySecretAccessToken",
            expires_in: 0,
          };
        return Promise.resolve("MySecretAccessToken");
      },
    } as auth0.Auth0VueClient);

    const src = "http://localhost/image.jpg";

    // Act
    const wrapper = mount(ProtectedImage, {
      props: {
        src,
      },
    });
    await flushPromises();

    const el = wrapper.element as HTMLImageElement;

    // Assert
    expect(el.src).eq(
      "http://localhost/image.jpg?auth=Bearer+MySecretAccessToken"
    );
  });

  it("should return the same path if no access token is given", async () => {
    // Arrange
    vi.spyOn(auth0, "useAuth0").mockReturnValueOnce({
      getAccessTokenSilently: (o) => {
        if (o?.detailedResponse)
          return {
            id_token: "",
            access_token: "",
            expires_in: 0,
          };
        return Promise.resolve("");
      },
    } as auth0.Auth0VueClient);

    const src = "http://localhost/image.jpg";

    // Act
    const wrapper = mount(ProtectedImage, {
      props: {
        src,
      },
    });
    await flushPromises();

    const el = wrapper.element as HTMLImageElement;

    // Assert
    expect(el.src).eq("http://localhost/image.jpg");
  });
});
