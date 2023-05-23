<template>
  <header
    class="sticky top-0 border-b border-label-separator bg-white-2 px-6 py-4 backdrop-blur-md"
  >
    <strong v-if="toolbarTitleStore().toolbarTitle" class="text-label-1">
      {{ toolbarTitleStore().toolbarTitle }}
    </strong>
  </header>
</template>
