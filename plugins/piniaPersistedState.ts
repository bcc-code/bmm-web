import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import type { Pinia } from "pinia";

export default defineNuxtPlugin((nuxtApp) => {
  const piniaApp = nuxtApp.$pinia as Pinia;
  piniaApp.use(piniaPluginPersistedstate);
});
