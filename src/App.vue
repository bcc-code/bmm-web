<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import { watch, ref } from "vue";
import useStore from "./composables/useStore";

const {
  isLoading,
  isAuthenticated,
  loginWithRedirect,
  getAccessTokenSilently,
} = useAuth0();
const { store } = useStore();
const hasToken = ref(false);

watch(isLoading, async loading => {
  if (loading) return;
  if (!isAuthenticated.value) {
    await loginWithRedirect();
  } else {
    const token = await getAccessTokenSilently();
    store.authenticated(token);
    hasToken.value = true;
  }
});
</script>

<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/browse">Browse</router-link>
    <router-link to="/search">Search</router-link>
  </nav>
  <main>
    <router-view v-if="hasToken" />
  </main>
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
