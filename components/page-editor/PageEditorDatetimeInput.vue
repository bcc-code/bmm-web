<script setup lang="ts" generic="T">
const props = defineProps<{
  modelValue: T;
}>();

const emit = defineEmits<{
  "update:modelValue": [string];
}>();

const value = computed({
  get() {
    return String(props.modelValue);
  },
  set(v) {
    console.log(v);
    emit("update:modelValue", v);
  },
});
</script>

<template>
  <input type="datetime-local" v-model="value" />
</template>
