export default defineNuxtPlugin((nuxtApp) => {
  window.addEventListener("route-changed", (_e) => {
    const e = _e as CustomEvent<string>;
    navigateTo(e.detail)
      .then(() => {
        const { search } = window.location;
        if (
          (search.includes("code=") || search.includes("error=")) &&
          search.includes("state=")
        )
          return nuxtApp.vueApp.config.globalProperties.$auth0.handleRedirectCallback();
        return null;
      })
      .catch((err) => {
        // TODO: How should we deal with this ..?
        console.error("Route-changed failed", err);
      });
  });
});
