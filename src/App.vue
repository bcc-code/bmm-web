<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import { watch } from "vue";

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
      <router-link to="/">Home</router-link>
      <router-link to="/browse">Browse</router-link>
      <router-link to="/search">Search</router-link>
    </nav>
    <main class="overflow-scroll">
      <router-view v-if="!isLoading" />
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
