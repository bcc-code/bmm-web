<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
});
</script>

<template>
  <NuxtLayout>
    <div class="p-6 max-w-7xl mx-auto">
      <NuxtPage />
    </div>
  </NuxtLayout>
</template>
