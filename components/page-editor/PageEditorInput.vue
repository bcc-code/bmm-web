<script setup lang="ts">
type InputType =
  | "text"
  | "number"
  | "datetime-local"
  | "checkbox"
  | "select"
  | "color";

defineProps<{
  label: string;
  type?: InputType;
  options?: (string | null)[];
}>();

const boxTypes: InputType[] = ["text", "number", "color"];

const modelValue = defineModel<string | number | boolean | Date | null>({});

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <div>
    <label
      v-if="!type || boxTypes.includes(type)"
      class="flex flex-col items-start gap-1"
    >
      <div class="flex w-full justify-between gap-4">
        <span class="type-subtitle-3 text-label-3">{{ label }}</span>
        <button
          v-if="modelValue"
          class="type-subtitle-3 text-label-4"
          @click="modelValue = null"
        >
          Reset
        </button>
      </div>
      <input
        class="rounded-lg border border-label-separator bg-background-1 px-2 py-1"
        v-bind="$attrs"
        :type="type"
        v-model="modelValue"
      />
    </label>
    <label
      v-if="type === 'datetime-local'"
      class="flex flex-col items-start gap-1"
    >
      <div class="flex w-full justify-between gap-4">
        <span class="type-subtitle-3 text-label-3">{{ label }}</span>
        <button
          v-if="modelValue"
          class="type-subtitle-3 text-label-4"
          @click="modelValue = null"
        >
          Reset
        </button>
      </div>
      <PageEditorDatetimeInput
        class="rounded-lg border border-label-separator bg-background-1 px-2 py-1"
        v-bind="$attrs"
        v-model="modelValue"
      />
    </label>
    <label
      v-if="type == 'checkbox'"
      class="grid grid-cols-[1.2em_auto] items-center gap-2"
    >
      <input
        type="checkbox"
        class="grid aspect-square appearance-none place-items-center overflow-hidden rounded-md border border-label-separator bg-background-1 before:size-full before:scale-0 before:bg-tint before:text-center before:text-sm before:text-on-color-1 checked:before:scale-100"
        :placeholder="label"
        v-bind="$attrs"
        :checked="Boolean(modelValue)"
        @change="modelValue = ($event.target as HTMLInputElement).checked"
      />
      <span class="type-subtitle-3 text-label-3">{{ label }}</span>
    </label>
    <label v-if="type == 'select'" class="flex flex-col items-start gap-1">
      <div class="flex w-full justify-between gap-4">
        <span class="type-subtitle-3 text-label-3">{{ label }}</span>
        <button
          v-if="modelValue"
          class="type-subtitle-3 text-label-4"
          @click="modelValue = null"
        >
          Reset
        </button>
      </div>
      <select
        class="rounded-lg border border-label-separator bg-background-1 px-2 py-1"
        :placeholder="label"
        v-bind="$attrs"
        v-model="modelValue"
      >
        <option v-for="option in options" :value="option">
          {{ option }}
        </option>
      </select>
    </label>
  </div>
</template>

<style scoped>
input[type="checkbox"]::before {
  content: "✓";
}
</style>
