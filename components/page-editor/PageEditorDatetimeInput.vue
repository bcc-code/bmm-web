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
  <input type="datetime-local" v-model="value" />
</template>
