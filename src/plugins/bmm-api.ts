import { inject } from "vue";
import { AUTH0_INJECTION_KEY } from "@auth0/auth0-vue";
import { Configuration, DefaultConfig } from "@bcc-code/bmm-sdk-fetch";

export default () => {
  DefaultConfig.config = new Configuration({
    basePath: import.meta.env.VITE_API_URL,
    headers: {
      "Accept-Language": "nb,en,zxx",
    },
    middleware: [
      {
        pre: async (ctx) => {
          const { getAccessTokenSilently, isAuthenticated } =
            inject(AUTH0_INJECTION_KEY)!;
          const token = isAuthenticated.value
            ? await getAccessTokenSilently()
            : null;

          const headers = new Headers(ctx.init.headers);
          if (token) {
            headers.set("Authorization", `Bearer ${token}`);
          }

          ctx.init.headers = headers;

          return ctx;
        },
      },
    ],
  });
};
