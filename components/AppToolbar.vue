<template>
  <header
    class="sticky top-0 z-10 flex justify-between border-b border-label-separator bg-white-2 px-6 py-4 backdrop-blur-md dark:bg-black-2"
  >
    <strong
      v-if="toolbarTitleStore().toolbarTitle"
      class="text-label-1 dark:text-label-dark-1"
    >
      {{ toolbarTitleStore().toolbarTitle }}
    </strong>

    <div class="flex flex-row">
      <ChangeLocale class="mx-4" />
      <ProfileMenu />
    </div>
  </header>
</template>
