<template>
  <header
    class="sticky top-0 z-10 flex justify-between border-b border-label-separator bg-white-2 px-6 py-4 backdrop-blur-md"
  >
    <strong v-if="toolbarTitleStore().toolbarTitle" class="text-label-1">
      {{ toolbarTitleStore().toolbarTitle }}
    </strong>
    <ChangeLocale class="mx-4" />
    <ProfileMenu />
  </header>
</template>
