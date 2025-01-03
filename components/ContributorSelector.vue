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
}>();

const modelValue = defineModel<ContributorModel[]>();
const searchTerm = ref<string>("");
const contributors = ref<ContributorModel[]>([]);

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

watch(modelValue, (newValue, oldValue) => {
  if (!newValue || !oldValue) return;

  if (newValue !== oldValue) {
    searchTerm.value = "";
    contributors.value = [];
  }
});
</script>

<template>
  <ComboSearchBox
    v-model:search="searchTerm"
    v-model="modelValue"
    :label="label"
    :options="contributors"
    :option-key="(c) => c.id"
    :display-value="(option) => option.name!"
  >
    <template #option="{ option, selected }">
      <div class="flex grow items-baseline gap-2">
        <span>{{ option.name }}</span>
        <div class="type-subtitle-3 flex items-baseline gap-0.5 text-label-3">
          <span>{{ option.interpretReferences }}</span>
          ·
          <span>{{ option.otherReferences }}</span>
        </div>
        <NuxtIcon
          :class="[
            'ml-auto',
            { 'opacity-100': selected, 'opacity-0': !selected },
          ]"
          name="icon.checkmark"
        />
      </div>
    </template>
  </ComboSearchBox>
</template>
