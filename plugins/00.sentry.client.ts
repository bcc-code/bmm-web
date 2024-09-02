import * as Sentry from '@sentry/vue'

export default defineNuxtPlugin(({ vueApp }) => {
	const runtimeConfig = useRuntimeConfig();
	const router = useRouter()

	const sentry = Sentry.init({
		app: vueApp,
		dsn: runtimeConfig.public.sentry.dsn,
		integrations: [
			Sentry.browserTracingIntegration({ router }),
			Sentry.browserProfilingIntegration()
		],
		tracesSampleRate: 0.5,
		profilesSampleRate: 0.5,
	})

	return {
		provide: {
			sentry
		}
	}
})