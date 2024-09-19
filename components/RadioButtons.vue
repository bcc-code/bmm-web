<script
  setup
  lang="ts"
  generic="T extends string | number | boolean | Record<string, unknown>"
>
import { RadioGroup, RadioGroupOption } from "@headlessui/vue";

defineProps<{
  options: T[];
}>();

const modelValue = defineModel<T>({ required: true });
</script>

<template>
  <RadioGroup v-model="modelValue">
    <RadioGroupOption
      v-for="(option, index) in options"
      :key="index"
      v-slot="{ checked }"
      :value="option"
    >
      <slot name="option" :option="option" :is-selected="checked" />
    </RadioGroupOption>
  </RadioGroup>
</template>
