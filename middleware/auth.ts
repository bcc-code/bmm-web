import { useAuth0 } from "@auth0/auth0-vue"

export default defineNuxtRouteMiddleware(async (to) => {
	const { isAuthenticated, loginWithRedirect } = useAuth0()
	if (process.server) return

	if (!isAuthenticated.value) {
		await loginWithRedirect()
	}
})