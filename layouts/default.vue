<script lang="ts" setup></script>

<template>
  <div class="flex h-full">
    <AppSidebar />
    <main class="flex-grow">
      <AppToolbar />
      <slot />
    </main>
  </div>
</template>
