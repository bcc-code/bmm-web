<script setup lang="ts">
import { watch } from 'vue';
import HelloWorld from './components/HelloWorld.vue'
import { useStorage } from '@vueuse/core'
import { useAuth0 } from '@auth0/auth0-vue'
import { useUserStore } from './stores/userStore';

const userStore = useUserStore()
const homeUrl = '/status'
const homeUrlState = useStorage('home-url', { url: homeUrl })

watch(useAuth0().isLoading, async(newIsLoading) => {
  if(!newIsLoading && userStore.isUserAuthenticated)
    window.location.href = homeUrlState.value.url
    userStore.handleLogin()
})
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
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
</style>
