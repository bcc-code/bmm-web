<script setup lang="ts">
import { DialogDescription, DialogTitle } from "@headlessui/vue";

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
  <DialogPlain :show="show" @close="emit('close')">
    <div class="mx-5 flex items-center justify-between py-3">
      <DialogTitle class="type-title-1 mr-2">
        <slot name="title" :title="title">
          {{ title }}
        </slot>
      </DialogTitle>
      <ButtonStyled
        v-if="!hideButton"
        intent="primary"
        size="small"
        @click.stop="emit('close')"
      >
        {{ $t("profile.done") }}
      </ButtonStyled>
    </div>
    <hr class="dark:label-dark-1 border-label-1 opacity-10" />
    <div class="max-h-[70vh] overflow-auto p-5">
      <DialogDescription v-if="description" class="mb-4 text-label-2">
        <slot name="description">
          {{ description }}
        </slot>
      </DialogDescription>
      <slot />
    </div>
  </DialogPlain>
</template>
