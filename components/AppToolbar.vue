<script setup type="ts">
const route = useRoute();
const showBackButton = () =>  route.name !== "index" && route.name !== "search" && route.name !== "browse";
</script>
<template>
  <header
    class="sticky top-0 z-20 flex justify-between border-b border-label-separator bg-white-2 backdrop-blur-md dark:bg-black-2"
  >
    <div class="flex flex-row mx-5">
      <div
        v-if="showBackButton()"
        class="p-4 cursor-pointer"
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

    <div class="flex flex-row mx-6 my-4">
      <ProfileMenu />
    </div>
  </header>
</template>
