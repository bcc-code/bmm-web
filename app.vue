<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
});
</script>

<template>
  <NuxtLayout>
    <div class="p-6">
      <NuxtPage />
    </div>
  </NuxtLayout>
</template>
