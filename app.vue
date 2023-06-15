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
    <div v-if="!isAuthenticated">
      You will be redirected to the login page. Please wait or
      <a href="#" @click="loginWithRedirect()">try again</a>.
    </div>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 200ms ease-out;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
