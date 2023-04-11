import auth0 from "@/auth0";
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
          const { getAccessTokenSilently, isAuthenticated } = auth0;
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
