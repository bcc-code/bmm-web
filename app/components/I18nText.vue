<script setup lang="ts">
const props = defineProps<{
  i18nKey: string;
}>();

const { t } = useI18n();

const translation = computed(() => {
  // eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys
  const text = t(props.i18nKey);
  const properties = text.matchAll(/<(\w*)>/g);
  return {
    text: text.split(/<\w*>/),
    properties: Array.from(properties).map((x) => x[1]),
  };
});
</script>

<template>
  <p>
    <template v-for="(part, index) in translation.text" :key="part">
      {{ part }}
      <slot :name="translation.properties[index]" />
    </template>
  </p>
</template>
