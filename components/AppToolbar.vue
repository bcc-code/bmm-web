<script setup type="ts">
const route = useRoute();
const hasHistory = () => window.history.length > 1; // using a computed() doesn't work on inital load in the Electron app. No idea why. See PR #433
</script>
<template>
  <header
    class="sticky top-0 z-20 flex justify-between border-b border-label-separator bg-background-toolbar backdrop-blur-md"
    style="-webkit-app-region: drag"
  >
    <div class="mx-5 flex flex-row">
      <div class="flex flex-col justify-center pr-6">
        <svg
          class="fill-current block h-6 w-6"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Mobile menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
        </svg>
      </div>
      <div
        class="teleport ml-[-0.75rem]"
        style="-webkit-app-region: no-drag"
      ></div>
      <div
        v-if="
          hasHistory &&
          route.name !== 'index' &&
          route.name !== 'search-term' &&
          route.name !== 'browse'
        "
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

    <div
      class="mx-6 flex flex-row items-center"
      style="-webkit-app-region: no-drag"
    >
      <ProfileMenu />
    </div>
  </header>
</template>
