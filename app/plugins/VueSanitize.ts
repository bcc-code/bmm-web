import VueSanitize from "vue-sanitize-directive";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueSanitize);
});
