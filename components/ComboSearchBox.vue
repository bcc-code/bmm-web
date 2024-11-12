<script
  setup
  lang="ts"
  generic="TOption extends string | number | boolean | object"
>
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  ComboboxButton,
  ComboboxLabel,
} from "@headlessui/vue";

defineProps<{
  label?: string;
  options: TOption[];
  optionKey: (option: TOption) => string | number;
  displayValue: (option: TOption) => string;
}>();

const modelValue = defineModel<TOption>();
const search = defineModel<string>("search");
</script>

<template>
  <Combobox v-model="modelValue" as="div">
    <ComboboxLabel v-if="label" class="type-subtitle-2 mb-1 block text-label-1">
      {{ label }}
    </ComboboxLabel>
    <div class="relative w-max">
      <ComboboxInput
        class="rounded-lg border border-label-separator bg-background-2 px-4 py-2"
        :display-value="(option) => displayValue(option as TOption)"
        @change="search = $event.target.value"
      />
      <ComboboxButton class="absolute right-3 top-1/2 -translate-y-1/2">
        <NuxtIcon name="icon.search" />
      </ComboboxButton>
    </div>
    <ComboboxOptions class="absolute z-50 rounded-xl p-1">
      <div
        class="min-w-56 max-w-80 select-none overflow-y-auto whitespace-nowrap rounded-xl bg-background-3 p-1 text-sm shadow-lg ring-1 ring-label-separator focus-visible:outline-none"
      >
        <ComboboxOption
          v-for="(option, index) in options"
          :key="optionKey(option)"
          v-slot="{ active }"
          :value="option"
          as="template"
        >
          <div
            :class="[
              'type-subtitle-2 flex w-full items-center justify-between whitespace-normal rounded-lg px-3 py-2 text-left',
              {
                'bg-label-separator': active,
              },
            ]"
          >
            <slot name="option" :option :index />
          </div>
        </ComboboxOption>
      </div>
    </ComboboxOptions>
  </Combobox>
</template>
