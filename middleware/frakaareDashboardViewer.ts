// eslint-disable-next-line consistent-return
export default defineNuxtRouteMiddleware(async () => {
	const { data: currentUser } = await useCurrentUser();
	if (!isFraKaareDashboardViewer(currentUser.value)) return navigateTo("/");
});