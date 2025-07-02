<script setup lang="ts">
const props = defineProps<{
  modelValue: unknown;
}>();

const emit = defineEmits<{
  "update:modelValue": [string];
}>();

const value = computed({
  get() {
    return String(props.modelValue);
  },
  set(v) {
    emit("update:modelValue", v);
  },
});
</script>

<template>
  <input v-model="value" type="datetime-local" />
</template>
