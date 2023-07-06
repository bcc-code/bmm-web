<script lang="ts" setup>
defineSlots<{
  default: (props: {}) => any;
}>();

const onError = (error: any) => {
  console.error(error);
};

const { currentTrack } = useNuxtApp().$mediaPlayer;
</script>

<template>
  <div
    class="flex h-full max-h-[100vh] overflow-y-hidden bg-background-1 text-black-1 dark:bg-background-dark-1 dark:text-white-1"
  >
    <SidebarElement />
    <main class="relative flex-grow overflow-y-auto">
      <AppToolbar />
      <NuxtErrorBoundary @error="onError">
        <slot />
        <template #error="{ error }">
          <ErrorMsg :error="error.value" />
        </template>
      </NuxtErrorBoundary>
    </main>
    <transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      leave-active-class="transition-all duration-200 ease-out"
      leave-to-class="opacity-0 translate-y-2"
    >
      <MediaPlayer v-if="currentTrack !== undefined" />
    </transition>
  </div>
</template>
