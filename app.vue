<script lang="ts" setup>
import { useAuth0 } from "@auth0/auth0-vue";

const { isLoading, loginWithRedirect, isAuthenticated, error, logout } =
  useAuth0();

watch(
  isLoading,
  async (loading) => {
    if (loading) return;
    if (!isAuthenticated.value) {
      await loginWithRedirect();
    }
  },
  { immediate: true },
);

const logoutAndRedirect = async () => {
  await logout({ openUrl: false });
  await loginWithRedirect();
};

useHead({
  titleTemplate: (chunk) => (chunk ? `${chunk} | BMM` : "BMM"),
});
</script>

<template>
  <div class="h-full">
    <NuxtLayout v-if="isAuthenticated && !error">
      <div class="container mx-auto p-2 lg:p-5">
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
