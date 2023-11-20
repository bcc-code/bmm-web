<script setup lang="ts">
defineProps<{
  show: boolean;
  title: string;
}>();

const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="relative z-30">
      <div class="fixed inset-0 bg-background-dark-1 opacity-40"></div>

      <div
        class="fixed inset-0 flex items-center justify-center"
        @click="emit('close')"
      >
        <div
          class="bg-background-1 text-black-1 dark:text-white-1 rounded-2xl"
          @click.stop
        >
          <div class="px-5 py-3">{{ title }}</div>
          <div class="bg-label-1 h-[1px] opacity-10"></div>
          <div class="px-5">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
