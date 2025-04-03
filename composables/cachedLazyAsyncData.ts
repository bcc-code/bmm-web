import type { AsyncDataOptions } from "#app";

/**
 * A thin wrapper around useLazyAsyncData that gets already fetched data, if available
 * 
 * @param key The cache key
 * @param fn The async function fetching the data
 * @param options Additional options
 * @returns 
 */
export function useCachedLazyAsyncData<T>(key: string, fn: () => Promise<T>, options?: AsyncDataOptions<T, any>) {
	return useLazyAsyncData(key, fn, {
		getCachedData(k, nuxtApp) {
			return nuxtApp.payload.data[k] ?? nuxtApp.static.data[k];
		},
		...options
	});
}