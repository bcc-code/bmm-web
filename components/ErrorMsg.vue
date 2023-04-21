<script lang="ts" setup>
const props = defineProps<{
  error: TypeError;
}>();

const errorComp = computed(() => props.error);
</script>

<template>
  <pre class="bg-red-100 p-6 text-red-700">
    {{ errorComp }}
  </pre>
</template>
