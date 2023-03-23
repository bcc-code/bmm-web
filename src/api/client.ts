import auth0 from "@/auth0";
import { BaseAPI, Configuration, Middleware } from "@bcc-code/bmm-sdk-fetch";

type TokenFactory = () => Promise<string | null>;

export class Client {
  constructor(tokenFactory: TokenFactory) {
    this.middleware = {
      pre: async (ctx) => {
        const token = await tokenFactory();

        const headers = new Headers(ctx.init.headers);
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }

        ctx.init.headers = headers;

        return ctx;
      },
    };
  }

  private middleware: Middleware;

  public use<T extends BaseAPI>(Api: new (configuration: Configuration) => T) {
    return new Api(
      new Configuration({
        basePath: import.meta.env.VITE_API_URL,
        headers: {
          "Accept-Language": "nb,en,zxx",
        },
        middleware: [this.middleware],
      })
    );
  }
}

export default new Client(async () => {
  const { getAccessTokenSilently, isAuthenticated } = auth0;
  if (!isAuthenticated.value) {
    return null;
  }
  return getAccessTokenSilently();
});
