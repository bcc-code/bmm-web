import { Configuration, DefaultConfig } from "@bcc-code/bmm-sdk-fetch";

export default defineNuxtPlugin((nuxtApp) => {
	const runtimeConfig = useRuntimeConfig()
	const { vueApp } = useNuxtApp()

	const {
		getAccessTokenSilently,
		isAuthenticated
	} = vueApp.config.globalProperties.$auth0;

	DefaultConfig.config = new Configuration({
		basePath: runtimeConfig.public.apiUrl,
		headers: {
			"Accept-Language": "nb,en,zxx",
		},
		middleware: [
			{
				pre: async (ctx) => {

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