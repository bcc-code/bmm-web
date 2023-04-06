<script lang="ts" setup>
const onError = (error: any) => {
  console.error(error);
};
</script>

<template>
  <div class="flex h-full">
    <Sidebar />
    <main class="flex-grow overflow-y-auto relative">
      <Toolbar />
      <NuxtErrorBoundary @error="onError">
        <slot />
        <template #error="{ error }">
          <Error :error="error.value" />
        </template>
      </NuxtErrorBoundary>
    </main>
  </div>
</template>
