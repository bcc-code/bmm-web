<script setup lang="ts">
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
  background: #A4E16A;
  border-radius: 12px;
}
</style>
