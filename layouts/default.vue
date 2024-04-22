<script lang="ts" setup>
import "../assets/main.css";

defineSlots<{
  default: (props: {}) => any;
}>();

const runtimeConfig = useRuntimeConfig();
const isElectron = runtimeConfig.public.systemName === "Electron";

const { queue } = useNuxtApp().$mediaPlayer;
</script>

<template>
  <div
    class="flex h-screen bg-background-1 text-black-1 dark:text-white-1"
    :class="{ 'select-none': isElectron }"
  >
    <SidebarElement />
    <main class="relative flex-grow overflow-y-scroll">
      <AppToolbar />
      <div class="flex flex-row">
        <Suspense>
          <slot />
        </Suspense>

        <transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-2"
          leave-active-class="transition-all duration-200 ease-out"
          leave-to-class="opacity-0 translate-y-2"
        >
          <MediaPlayer v-if="queue.length > 0" />
        </transition>
      </div>
    </main>
  </div>
</template>
