<script setup lang="ts">
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";

defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <TransitionRoot :show="show" as="template">
    <Dialog :open="show" class="relative z-110" @close="emit('close')">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <DialogBackdrop class="fixed inset-0 z-100 bg-[#000000]/[0.6]" />
      </TransitionChild>

      <div
        class="fixed inset-0 flex content-center items-center justify-center"
        @click="emit('close')"
      >
        <TransitionChild
          as="template"
          enter="duration-200 ease-out"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel
            class="dialog-shadow max-w-3xl rounded-2xl bg-background-1 text-label-1"
            @click.stop
          >
            <slot />
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>
.dialog-shadow {
  box-shadow:
    0px 0px 0px 0.5px #0000000d,
    0px 0px 1px 1px #0000000d,
    0px 20px 52px 0px #00000040;
}
</style>
