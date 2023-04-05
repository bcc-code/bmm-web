// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		'@nuxt/devtools',
		'@nuxtjs/tailwindcss',
	],
	css: ['assets/main.css'],
	routeRules: {
		'/**': {
			ssr: false
		}
	},
	runtimeConfig: {
		public: {
			apiUrl: 'https://bmm-api.brunstad.org',
			authUrl: 'https://login.bcc.no',
			clientId: 'L9891KdcqtoKmHg4r65lT7zbSjv55dNN'
		}
	}
})
