<script lang="ts" setup>
import { useAuth0 } from "@auth0/auth0-vue";

const { $appInsights } = useNuxtApp();

const { isLoading, loginWithRedirect, isAuthenticated, error, logout } =
  useAuth0();
const runtimeConfig = useRuntimeConfig();
const isElectron = runtimeConfig.public.systemName === "Electron";

// Redirect to new domain for testers that still use the old host name.
const oldDomain = "bmm-web.brunstad.org";
if (window.location.origin.endsWith(oldDomain)) {
  const newPath = window.location
    .toString()
    .replace(oldDomain, config.websiteDomain);
  window.location.href = newPath;
}

const promptToOpenInDesktopApp = (url: string) =>
  new Promise((resolve) => {
    // create temp frame where url will be opened
    const frame = document.createElement("iframe");
    frame.name = `_invoker_${Math.random()}`;

    // create temp link and set it's target to temp frame
    const link = document.createElement("a");
    link.href = url;
    link.target = frame.name;

    // frame must be appended to body otherwise link will open in new tab, and might trigger popup blocker
    document.body.appendChild(frame);

    setTimeout(() => {
      frame?.parentNode?.removeChild(frame);
      resolve(null);
    }, 2000);

    // a simple link.click() did not work in firefox hence we're using dispatchEvent
    link.dispatchEvent(new MouseEvent("click"));
  });

if (!isElectron && window.location.pathname.startsWith("/track/")) {
  // Links to tracks account for 90% of the links shared in the app.
  // Other links can be annoying when hitting refresh in the browser, since it will prompt the user again.
  // But /track/* will redirect the user to the album and hitting refresh doesn't cause the prompt to happen again.
  // As far as I can tell, Spotify also only opens the app for links to tracks.
  const adjustedLink = window.location
    .toString()
    .replace("https://", `${config.appProtocol}://`)
    .replace("http://", `${config.appProtocol}://`);
  promptToOpenInDesktopApp(adjustedLink);
}

watch(
  isLoading,
  async (loading) => {
    if (loading) return;

    if (!isAuthenticated.value) {
      $appInsights.event("auth0 - redirect to login", {});
      await loginWithRedirect();
    }
  },
  { immediate: true },
);

watch(error, async (e) => {
  if (e) {
    const errorCode = e.error;
    console.error(e.message, errorCode);
    const tryLogoutAndRelogin =
      errorCode === "missing_refresh_token" || errorCode === "invalid_grant";
    $appInsights.event("auth0 - error", {
      error: errorCode,
      message: e.message,
      stack: e.stack,
      tryLogoutAndRelogin,
    });
    if (tryLogoutAndRelogin) {
      // For these errors we've identified that a logout & relogin likely will fix it.
      await logout({ openUrl: false });
      await loginWithRedirect();
    }
  }
});

const logoutAndRedirect = async () => {
  $appInsights.event("auth0 - user clicked logoutAndRedirect()", {
    error: error.value.error,
    message: error.value.message,
    stack: error.value.stack,
  });
  await logout({ openUrl: false });
  await loginWithRedirect();
};

const { locale } = useI18n();
locale.value = useProfileStore().uiLanguage;
useProfileStore().$subscribe((_, state) => {
  locale.value = state.uiLanguage;
});

useHead({
  titleTemplate: (chunk) => (chunk ? `${chunk} - BMM` : "BMM"),
});
</script>

<template>
  <div class="h-full">
    <NuxtLayout v-if="isAuthenticated && !error">
      <div class="container mx-auto min-w-80 px-2 pb-20 lg:px-9">
        <NuxtPage />
        <div class="teleport"></div>
      </div>
    </NuxtLayout>
    <div
      v-else-if="!isAuthenticated"
      class="flex h-screen text-center"
      style="-webkit-app-region: drag"
    >
      <div class="m-auto">
        <SiteLogo size="medium"></SiteLogo>
        <div>{{ $t("login.redirect-message.redirect-info") }}</div>
        <i18n-t tag="div" keypath="login.redirect-message.manual-redirect-info">
          <span
            class="cursor-pointer underline"
            href="#"
            @click="loginWithRedirect()"
            >{{ $t("login.redirect-message.redirect-link") }}</span
          >
        </i18n-t>
      </div>
    </div>
    <div
      v-else
      class="flex h-screen text-center"
      style="-webkit-app-region: drag"
    >
      <div class="m-auto">
        <SiteLogo size="medium"></SiteLogo>
        <div>{{ $t("login.error-message.logout-and-redirect-info") }}</div>
        <div class="mb-5">{{ error }}</div>
        <i18n-t
          tag="div"
          class="mb-5"
          keypath="login.error-message.manual-logout-and-redirect-info"
        >
          <span
            class="cursor-pointer underline"
            href="#"
            @click="logoutAndRedirect()"
            >{{ $t("login.error-message.logout-and-redirect-link") }}</span
          >
        </i18n-t>
        <i18n-t tag="div" keypath="login.error-message.contact-info">
          <a
            class="cursor-pointer underline"
            href="mailto:bmm-support@bcc.no"
            target="_blank"
            >{{ $t("login.error-message.contact-link") }}</a
          >
        </i18n-t>
      </div>
    </div>
  </div>
</template>

<style>
html {
  color-scheme: light dark;
}
html.dark {
  color-scheme: dark;
}
html.light {
  color-scheme: light;
}
.page-enter-active,
.page-leave-active {
  transition: all 200ms ease-out;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
