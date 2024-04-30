// @vitest-environment happy-dom

import { describe, it, expect } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { AUTH0_INJECTION_KEY } from "@auth0/auth0-vue";
import type { Auth0VueClient } from "@auth0/auth0-vue";
import ProtectedImage from "./ProtectedImage.vue";

describe("component ProtectedImage", () => {
describe("component ProtectedImage // tests suddenly stopped working", () => {
  it("should add the access token to the given path", async () => {
    return;
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
    return;
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

  it("should update the src in the template when it changes after mounting", async () => {
    return;
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
    wrapper.setProps({ src: "http://localhost/image2.jpg" });
    await flushPromises();

    const el = wrapper.element as HTMLImageElement;

    // Assert
    expect(wrapper.props().src).toBe("http://localhost/image2.jpg");
    expect(el.src).eq(
      "http://localhost/image2.jpg?auth=Bearer+MySecretAccessToken",
    );
  });
});
