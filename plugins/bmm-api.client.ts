import { useAuth0 } from "@auth0/auth0-vue";
import { Configuration, DefaultConfig } from "@bcc-code/bmm-sdk-fetch";

export default defineNuxtPlugin((nuxtApp) => {
	const runtimeConfig = useRuntimeConfig()

	DefaultConfig.config = new Configuration({
		basePath: runtimeConfig.public.apiUrl,
		headers: {
			"Accept-Language": "nb,en,zxx",
		},
		middleware: [
			{
				pre: async (ctx) => {
					const { getAccessTokenSilently, isAuthenticated } = useAuth0();

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
})