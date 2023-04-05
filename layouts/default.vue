<script lang="ts" setup></script>

<template>
  <div class="flex h-full">
    <Sidebar />
    <main class="flex-grow">
      <Toolbar />
      <slot />
    </main>
  </div>
</template>
