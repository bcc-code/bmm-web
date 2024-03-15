<script setup type="ts">
const route = useRoute();
const showBackButton = computed(() => globalThis.history.length > 1 && route.name !== "index" && route.name !== "search-term" && route.name !== "browse");
</script>
<template>
  <header
    class="sticky top-0 z-20 flex justify-between border-b border-label-separator bg-background-toolbar backdrop-blur-md"
    style="-webkit-app-region: drag"
  >
    <div class="flex flex-row mx-5">
      <div
        class="teleport ml-[-0.75rem]"
        style="-webkit-app-region: no-drag"
      ></div>
      <div
        v-if="showBackButton"
        class="p-4 cursor-pointer"
        style="-webkit-app-region: no-drag"
        @click="$router.back()"
      >
        <NuxtIcon name="icon.chevron.left-1" class="text-2xl" />
      </div>
      <strong
        v-if="toolbarTitleStore().toolbarTitle"
        class="text-label-1 mx-1 my-4"
      >
        {{ toolbarTitleStore().toolbarTitle }}
      </strong>
    </div>

    <div class="flex flex-row mx-6 my-4" style="-webkit-app-region: no-drag">
      <ProfileMenu />
    </div>
  </header>
</template>
