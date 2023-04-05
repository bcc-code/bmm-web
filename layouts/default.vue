<script lang="ts" setup>
const onError = (error: any) => {
  console.error(error);
};
</script>

<template>
  <div class="flex h-full">
    <Sidebar />
    <main class="flex-grow">
      <Toolbar />
      <NuxtErrorBoundary @error="onError">
        <slot />
      </NuxtErrorBoundary>
    </main>
  </div>
</template>
