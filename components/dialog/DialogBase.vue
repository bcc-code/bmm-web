<script setup lang="ts">
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";

defineProps<{
  show: boolean;
  title: string;
}>();

const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <Dialog :open="show" class="relative z-30" @close="emit('close')">
    <DialogBackdrop class="fixed inset-0 bg-background-4 opacity-40" />

    <div
      class="fixed inset-0 flex items-center justify-center content-center"
      @click="emit('close')"
    >
      <DialogPanel
        class="bg-background-1 text-black-1 dark:text-white-1 rounded-2xl md:w-[500px] lg:w-[600px]"
        @click.stop
      >
        <div class="flex justify-between items-center mx-5">
          <DialogTitle class="py-4 font-semibold">{{ title }}</DialogTitle>
          <ButtonStyled
            intent="primary"
            size="small"
            @click.stop="emit('close')"
          >
            {{ $t("profile.done") }}
          </ButtonStyled>
        </div>
        <div class="bg-label-1 dark:bg-label-dark-1 h-[1px] opacity-10"></div>
        <div class="p-4">
          <slot />
        </div>
      </DialogPanel>
    </div>
  </Dialog>
</template>
