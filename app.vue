<script lang="ts" setup>
import { useAuth0 } from "@auth0/auth0-vue";

const { $appInsights } = useNuxtApp();

const { isLoading, loginWithRedirect, isAuthenticated, error, logout } =
  useAuth0();

// Redirect to new domain for testers that still use the old host name.
const oldDomain = "bmm-web.brunstad.org";
if (window.location.origin.endsWith(oldDomain)) {
  const newPath = window.location
    .toString()
    .replace(oldDomain, "bmm.bcc.media");
  window.location.href = newPath;
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
  titleTemplate: (chunk) => (chunk ? `BMM | ${chunk}` : "BMM"),
});
</script>

<template>
  <div class="h-full">
    <NuxtLayout v-if="isAuthenticated && !error">
      <div class="container mx-auto px-2 lg:px-9">
        <NuxtPage />
      </div>
    </NuxtLayout>
    <div v-else-if="!isAuthenticated" class="flex h-screen text-center">
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
    <div v-else class="flex h-screen text-center">
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
