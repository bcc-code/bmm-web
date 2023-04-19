// @vitest-environment happy-dom

import { describe, it, expect, vi, afterEach } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { AUTH0_INJECTION_KEY, Auth0VueClient } from "@auth0/auth0-vue";
import ProtectedImage from "./ProtectedImage.vue";

describe("component ProtectedImage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should add the access token to the given path", async () => {
    // Arrange
    const src = "http://localhost/image.jpg";

    // Act
    const wrapper = mount(ProtectedImage, {
      props: {
        src,
      },
      global: {
        provide: {
          [AUTH0_INJECTION_KEY.valueOf()]: {
            getAccessTokenSilently: (o) => {
              if (o?.detailedResponse)
                return {
                  id_token: "",
                  access_token: "MySecretAccessToken",
                  expires_in: 0,
                };
              return Promise.resolve("MySecretAccessToken");
            },
          } as Auth0VueClient,
        },
      },
    });
    await flushPromises();

    const el = wrapper.element as HTMLImageElement;

    // Assert
    expect(el.src).eq(`${src}?auth=Bearer+MySecretAccessToken`);
  });

  it("should return the same path if no access token is given", async () => {
    // Arrange
    const src = "http://localhost/image.jpg";

    // Act
    const wrapper = mount(ProtectedImage, {
      props: {
        src,
      },
      global: {
        provide: {
          [AUTH0_INJECTION_KEY.valueOf()]: {
            getAccessTokenSilently: (o) => {
              if (o?.detailedResponse)
                return {
                  id_token: "",
                  access_token: "",
                  expires_in: 0,
                };
              return Promise.resolve("");
            },
          } as Auth0VueClient,
        },
      },
    });
    await flushPromises();

    const el = wrapper.element as HTMLImageElement;

    // Assert
    expect(el.src).eq(src);
  });
});
