<script lang="ts" setup>
const route = useRoute();
</script>

<template>
  <header
    class="p-4 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky"
  >
    <strong v-if="route.meta.toolbarTitle">
      {{ route.meta.toolbarTitle }}
    </strong>
  </header>
</template>
