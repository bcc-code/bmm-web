import { createAuth0 } from "@auth0/auth0-vue";

export default defineNuxtPlugin((nuxtApp) => {
	const runtimeConfig = useRuntimeConfig()

	nuxtApp.vueApp.use(
		createAuth0({
			domain: runtimeConfig.public.authUrl,
			clientId: runtimeConfig.public.clientId,
			cacheLocation: "localstorage",
			authorizationParams: {
				redirect_uri: window.location.origin,
				audience: runtimeConfig.public.apiUrl,
			},
		})
	)
})