<script lang="ts" setup>
const onError = (error: any) => {
  console.error(error);
};
</script>

<template>
  <div class="flex h-full">
    <SidebarElement />
    <main class="flex-grow overflow-y-auto relative">
      <AppToolbar />
      <NuxtErrorBoundary @error="onError">
        <slot />
        <template #error="{ error }">
          <ErrorMsg :error="error.value" />
        </template>
      </NuxtErrorBoundary>
    </main>
    <footer>
      <MediaPlayer />
    </footer>
  </div>
</template>
