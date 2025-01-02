<script
  setup
  lang="ts"
  generic="TOption extends string | number | boolean | object"
>
import type { ContributorModel } from "@bcc-code/bmm-sdk-fetch";
import { ContributorApi } from "@bcc-code/bmm-sdk-fetch";

defineProps<{
  label?: string;
  options: TOption[];
  optionKey: (option: TOption) => string | number;
  displayValue: (option: TOption) => string;
}>();

const modelValue = defineModel<ContributorModel[]>();
const searchTerm = ref<string>("");
const contributors = ref<ContributorModel[]>([]);
//const search = defineModel<string>("search");

watchDebounced(
  searchTerm,
  async (search) => {
    if (search === "" || !search) {
      contributors.value = [];
      return;
    }
    contributors.value =
      await new ContributorApi().contributorSearchUnpublishedTermGet({
        term: search,
      });
  },
  { debounce: 100, immediate: true },
);
</script>

<template>
  <div>
    <div v-if="label" class="type-subtitle-2 mb-1 block text-label-1">
      {{ label }}
    </div>
    <div>
      <div
        v-for="item in modelValue"
        v-bind:key="item.id"
        class="bg-background-2 px-4 py-2"
      >
        {{ item.name }}
        <div class="inline-block" @click="modelValue = []">
          <NuxtIcon name="icon.close.small" class="opacity-50" />
        </div>
      </div>
    </div>
    <input
      ref="searchbox"
      v-model="searchTerm"
      type="text"
      placeholder="add a contributor"
      class="w-full truncate rounded-lg border border-label-separator bg-background-2 px-4 py-2"
    />
    <div v-if="contributors.length > 0" class="absolute z-50 rounded-xl p-1">
      <div
        class="min-w-56 max-w-80 select-none overflow-y-auto whitespace-nowrap rounded-xl bg-background-3 p-1 text-sm shadow-lg ring-1 ring-label-separator focus-visible:outline-none"
      >
        <div
          v-for="item in contributors"
          v-bind:key="item.id"
          class="type-subtitle-2 flex w-full items-center justify-between whitespace-normal rounded-lg px-3 py-2 text-left"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>
