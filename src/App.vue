<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import { inject, watch } from "vue";
import useStore from "./composables/useStore";

// logout
const {
  getAccessTokenSilently,
  isLoading,
  loginWithRedirect,
  user,
  isAuthenticated,
} = useAuth0();
const { store, state } = useStore();

watch(isLoading, async (loading) => {
  if (loading) return;
  if (!isAuthenticated.value) {
    await loginWithRedirect();
  } else {
    const token = await getAccessTokenSilently();
    store.authenticated(token);
  }
});

// logout({ logoutParams: { returnTo: window.location.origin } });
</script>

<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/browse">Browse</router-link>
    <router-link to="/search">Search</router-link>
  </nav>
  <main>
    <router-view />
  </main>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

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
