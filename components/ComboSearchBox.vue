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
  ComboboxLabel,
} from "@headlessui/vue";

defineProps<{
  label?: string;
  options: TOption[];
  optionKey: (option: TOption) => string | number;
  displayValue: (option: TOption) => string;
}>();

const modelValue = defineModel<TOption[]>();
const search = defineModel<string>("search");

function removeOption(option: TOption) {
  modelValue.value = modelValue.value?.filter((o) => o !== option);
}
</script>

<template>
  <Combobox v-model="modelValue" as="div" multiple>
    <ComboboxLabel v-if="label" class="type-subtitle-2 mb-1 block text-label-1">
      {{ label }}
    </ComboboxLabel>
    <div
      class="relative w-full rounded-lg border border-label-separator bg-background-2 p-2 outline-2 focus-within:outline"
    >
      <div class="relative flex flex-wrap gap-2">
        <TransitionGroup
          move-class="transition-all duration-300 ease-out"
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95"
          leave-active-class="transition-all duration-300 ease-out absolute"
          leave-to-class="opacity-0 scale-95"
        >
          <span
            v-for="option in modelValue"
            :key="optionKey(option)"
            class="type-subtitle-2 flex gap-2 truncate rounded-md border border-label-separator bg-background-3 py-1 pl-3 pr-2"
          >
            {{ displayValue(option) }}
            <button class="aspect-square h-full" @click="removeOption(option)">
              <NuxtIcon name="icon.close.small" class="opacity-50" />
            </button>
          </span>
        </TransitionGroup>
        <ComboboxInput
          class="w-full truncate bg-[transparent] px-2 focus-visible:outline-none"
          placeholder="Search..."
          @change="search = $event.target.value"
        />
      </div>
    </div>
    <ComboboxOptions class="absolute z-50 rounded-xl p-1">
      <div
        class="min-w-56 max-w-80 select-none overflow-y-auto whitespace-nowrap rounded-xl bg-background-3 p-1 text-sm shadow-lg ring-1 ring-label-separator focus-visible:outline-none"
      >
        <ComboboxOption
          v-for="(option, index) in options"
          :key="optionKey(option)"
          v-slot="{ active, selected }"
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
            <slot name="option" :option :index :selected :active />
          </div>
        </ComboboxOption>
      </div>
    </ComboboxOptions>
  </Combobox>
</template>
