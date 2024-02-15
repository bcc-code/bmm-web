<script setup lang="ts">
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  DialogDescription,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";

defineProps<{
  show: boolean;
  title: string;
  description?: string;
}>();

const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <TransitionRoot :show="show" as="template">
    <Dialog :open="show" class="relative z-40" @close="emit('close')">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <DialogBackdrop class="fixed inset-0 bg-background-4 opacity-40" />
      </TransitionChild>

      <div
        class="fixed inset-0 flex items-center justify-center content-center"
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
            <div
              class="bg-label-1 dark:bg-label-dark-1 h-[1px] opacity-10"
            ></div>
            <div class="p-5 overflow-auto max-h-[80vh]">
              <DialogDescription v-if="description" class="mb-4 text-label-2">
                {{ description }}
              </DialogDescription>
              <slot />
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
