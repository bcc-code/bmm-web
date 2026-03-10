<script lang="ts" setup>
const props = defineProps<{
  error: TypeError;
}>();

const errorComp = computed(() => props.error);
</script>

<template>
  <pre class="bg-red-100 text-red-700 p-6">
    {{ errorComp }}
  </pre>
</template>
