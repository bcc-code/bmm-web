<script setup lang="ts">
const { $appInsights } = useNuxtApp();
$appInsights.event("not implemented yet", { route: useRoute().name });
</script>
<template>
  <h1>The route {{ useRoute().name }} has not been implemented yet.</h1>
</template>
