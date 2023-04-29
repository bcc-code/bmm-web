<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <header
    class="flex justify-between py-4 px-6 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0"
  >
    <strong v-if="toolbarTitleStore().toolbarTitle">
      {{ toolbarTitleStore().toolbarTitle }}
    </strong>
    <light class="flex">
      Profile
      <IconComponent name="nav.profile" class="pl-1" />
    </light>
  </header>
</template>
