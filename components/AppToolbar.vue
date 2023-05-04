<template>
  <header
    class="py-4 px-6 border-b border-label-separator bg-white-2 backdrop-blur-md sticky top-0"
  >
    <strong v-if="toolbarTitleStore().toolbarTitle" class="text-label-1">
      {{ toolbarTitleStore().toolbarTitle }}
    </strong>
  </header>
</template>
