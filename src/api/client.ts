import { useAuth0 } from "@auth0/auth0-vue";
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

  public attach<T extends BaseAPI>(api: {
    new (configuration: Configuration): T;
  }) {
    return new api(
      new Configuration({
        middleware: [this.middleware],
      })
    );
  }
}

export default new Client(async () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  if (!isAuthenticated.value) {
    return null;
  }
  return await getAccessTokenSilently();
});
