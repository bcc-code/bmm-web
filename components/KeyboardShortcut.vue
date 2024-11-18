<script setup lang="ts">
const props = defineProps<{
  keys: string[];
}>();

const metaKeys = new Map<string, string>();
metaKeys.set("alt", "⌥");
metaKeys.set("ctrl", "⌃");
metaKeys.set("shift", "⇧");
metaKeys.set("meta", "⌘");

const formattedKeys = computed(() =>
  props.keys
    .map((key) => metaKeys.get(key) ?? key)
    .map((key) => key.toUpperCase())
    .join("+"),
);
</script>

<template>
  <kbd
    class="type-subtitle-3 inline-block rounded border border-b-4 border-label-2 bg-background-1 px-1 text-label-2"
  >
    {{ formattedKeys }}
  </kbd>
</template>
