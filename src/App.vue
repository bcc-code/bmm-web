<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import { watch } from "vue";
import privatePlaylist from "@/components/privatePlaylist.vue";
import ChangeLocale from "./components/ChangeLocale.vue";

// logout
const { isLoading, loginWithRedirect, isAuthenticated } = useAuth0();
watch(isLoading, async (loading) => {
  if (loading) return;
  if (!isAuthenticated.value) {
    await loginWithRedirect();
  }
});
</script>

<template>
  <div class="flex">
    <nav>
      <change-locale />
      <router-link to="/">{{ $t("nav.home") }}</router-link>
      <router-link to="/browse">{{ $t("nav.browse") }}</router-link>
      <router-link to="/search">{{ $t("nav.search") }}</router-link>
      <privatePlaylist v-if="isAuthenticated" />
    </nav>
    <main class="overflow-scroll p-5">
      <router-view v-if="isAuthenticated" />
    </main>
  </div>
</template>

<style scoped>
nav a {
  display: block;
  color: black;
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  padding: 12px;
}

nav a.router-link-active {
  background: #a4e16a;
  border-radius: 12px;
}
</style>
