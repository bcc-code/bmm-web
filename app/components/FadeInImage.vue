<script lang="ts" setup>
const props = defineProps<{
  src: string;
  alt?: string | undefined;
}>();

const loaded = ref(false);
watch(
  () => props.src,
  () => (loaded.value = false),
);
</script>
<template>
  <img
    :src="src"
    :alt="alt || ''"
    class="transition-opacity duration-500 ease-out"
    :class="{
      'opacity-0': !loaded,
      'opacity-100': loaded,
    }"
    loading="lazy"
    @load="loaded = true"
  />
</template>
