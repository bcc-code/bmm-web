<script setup type="ts">
const route = useRoute();
const showBackButton = computed(() => globalThis.history.length > 1 && route.name !== "index" && route.name !== "search-term" && route.name !== "browse");
</script>
<template>
  <header
    class="sticky top-0 z-20 flex justify-between border-b border-label-separator bg-background-toolbar backdrop-blur-md"
    style="-webkit-app-region: drag"
  >
    <div class="mx-5 flex flex-row">
      <div
        class="teleport ml-[-0.75rem]"
        style="-webkit-app-region: no-drag"
      ></div>
      <div
        v-if="showBackButton"
        class="cursor-pointer p-4"
        style="-webkit-app-region: no-drag"
        @click="$router.back()"
      >
        <NuxtIcon name="icon.chevron.left-1" class="text-2xl" />
      </div>
      <strong
        v-if="toolbarTitleStore().toolbarTitle"
        class="mx-1 my-4 text-label-1"
      >
        {{ toolbarTitleStore().toolbarTitle }}
      </strong>
    </div>

    <div class="mx-6 my-4 flex flex-row" style="-webkit-app-region: no-drag">
      <ProfileMenu />
    </div>
  </header>
</template>
