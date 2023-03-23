import { useAuth0 } from "@auth0/auth0-vue";
import { BaseAPI, Configuration, Middleware } from "@bcc-code/bmm-sdk-fetch";

export interface Token {
  type: "bearer";
  value: string;
};

type TokenFactory = () => Promise<Token | null>;

export class Client {
  constructor(tokenFactory: TokenFactory) {
    this.middleware = {
      pre: async (ctx) => {
        const token = await tokenFactory();
        const headers = new Headers(ctx.init.headers);

        let authHeader: string | null = null;
        if (token) {
          switch (token.type) {
            case "bearer":
              authHeader = "Bearer " + token.value;
              break;
            default:
              break;
          }
        }
        if (authHeader) {
          headers.set("Authorization", authHeader);
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
  const token = await getAccessTokenSilently();
  return {
    type: "bearer",
    value: token,
  };
});
