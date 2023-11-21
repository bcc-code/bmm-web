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
        class="fixed inset-0 flex items-center justify-center content-center"
        @click="emit('close')"
      >
        <div
          class="bg-background-1 text-black-1 dark:text-white-1 rounded-2xl md:w-[500px] lg:w-[600px]"
          @click.stop
        >
          <div class="flex justify-between mx-5">
            <div class="py-4 font-semibold">{{ title }}</div>
            <div class="align-middle self-center">
              <ButtonStyled
                intent="primary"
                size="small"
                @click.stop="emit('close')"
                >Done</ButtonStyled
              >
            </div>
          </div>
          <div class="bg-label-1 dark:bg-label-dark-1 h-[1px] opacity-10"></div>
          <div class="p-4">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
