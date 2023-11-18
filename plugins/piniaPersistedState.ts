import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import {Pinia} from "pinia";

export default defineNuxtPlugin((nuxtApp) => {
  const piniaApp = nuxtApp.$pinia as Pinia;
  piniaApp.use(piniaPluginPersistedstate);
});
