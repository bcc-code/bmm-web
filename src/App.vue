<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import { watch } from "vue";
import Toolbar from "./components/AppToolbar.vue";

// logout
const { isLoading, loginWithRedirect, isAuthenticated } = useAuth0();
watch(isLoading, async (loading) => {
  if (loading) return;
  if (!isAuthenticated.value) {
    await loginWithRedirect();
  }
});

const navLinks = [
  { to: "/", name: "Home" },
  { to: "/browse", name: "Browse" },
  { to: "/search", name: "Search" },
];
</script>

<template>
  <div class="flex">
    <nav
      class="bg-gray-50 border-r border-gray-100 p-4 sticky top-0 h-screen min-w-[200px]"
    >
      <router-link
        v-for="link in navLinks"
        :key="link.name"
        :to="link.to"
        class="p-2 rounded-lg flex"
        active-class="bg-lime-400"
      >
        {{ link.name }}
      </router-link>
    </nav>
    <div class="grow">
      <Toolbar />
      <main class="p-5 grow">
        <router-view v-if="isAuthenticated" />
      </main>
    </div>
  </div>
</template>
