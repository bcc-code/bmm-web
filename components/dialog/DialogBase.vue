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
  hideButton?: boolean;
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
        <DialogBackdrop class="fixed inset-0 z-30 bg-background-4 opacity-40" />
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
            class="rounded-2xl bg-background-1 text-black-1 dark:text-white-1"
            @click.stop
          >
            <div class="mx-5 flex items-center justify-between">
              <DialogTitle class="py-4 font-semibold">{{ title }}</DialogTitle>
              <ButtonStyled
                v-if="!hideButton"
                intent="primary"
                size="small"
                @click.stop="emit('close')"
              >
                {{ $t("profile.done") }}
              </ButtonStyled>
            </div>
            <div
              class="dark:bg-label-dark-1 h-[1px] bg-label-1 opacity-10"
            ></div>
            <div class="max-h-[80vh] overflow-auto p-5">
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
