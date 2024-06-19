<script setup lang="ts"></script>

<template>
  <header class="mb-12 flex gap-6">
    <div class="mt-10 w-[200px] min-w-28 lg:w-[240px] lg:shrink-0">
      <slot name="cover" />
    </div>
    <div class="flex flex-col justify-between pt-4 lg:px-6">
      <div>
        <slot name="heading" />
      </div>
      <div class="flex gap-2">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>
