<script lang="ts" setup>
import { useAuth0 } from "@auth0/auth0-vue";

const { isLoading, loginWithRedirect, isAuthenticated } = useAuth0();

watch(
  isLoading,
  async (loading) => {
    if (loading) return;
    if (!isAuthenticated.value) {
      await loginWithRedirect();
    }
  },
  { immediate: true }
);

useHead({
  titleTemplate: (chunk) => (chunk ? `${chunk} | BMM` : "BMM"),
});
</script>

<template>
  <div>
    <NuxtLayout v-if="isAuthenticated">
      <div class="container mx-auto p-2 lg:p-5">
        <NuxtPage />
      </div>
    </NuxtLayout>
    <div v-if="!isAuthenticated" class="flex h-screen text-center">
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
