<script lang="ts" setup>
const route = useRoute();
</script>

<template>
  <header
    class="py-4 px-6 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0"
  >
    <strong v-if="route.meta.toolbarTitle">
      {{ route.meta.toolbarTitle }}
    </strong>
  </header>
</template>
