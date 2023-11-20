<script lang="ts" setup>
import "../assets/main.css";

defineSlots<{
  default: (props: {}) => any;
}>();

const onError = (error: any) => {
  console.error(error);
};

const { queue } = useNuxtApp().$mediaPlayer;
</script>

<template>
  <div class="flex h-screen bg-background-1 text-black-1 dark:text-white-1">
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
      <MediaPlayer v-if="queue.length > 0" />
    </transition>
  </div>
</template>
