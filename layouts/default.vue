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
    class="flex h-screen overflow-hidden bg-background-1 text-black-1 dark:text-white-1"
    :class="{ 'select-none': isElectron }"
  >
    <SidebarElement />
    <main
      class="relative flex-grow overflow-x-hidden overflow-y-scroll md:overflow-x-scroll"
    >
      <AppToolbar />
      <div class="flex flex-row">
        <Suspense>
          <slot />
        </Suspense>

        <MediaPlayer v-if="queue.length > 0" />
      </div>
      <DialogErrorDialog />
    </main>
  </div>
</template>
