<script lang="ts" setup>
const props = defineProps<{
  name: string;
  filled: boolean;
}>();
</script>

<template>
  <span>
    <nuxt-icon :name="props.name" :filled="props.filled" />
  </span>
</template>
