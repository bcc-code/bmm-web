<script lang="ts" setup>
defineProps<{
  src?: string | undefined | null;
  alt?: string;
  noBorder?: boolean;
}>();
</script>
<template>
  <div class="aspect-square bg-background-2">
    <ProtectedImage
      v-if="src"
      :src="src"
      :alt="alt"
      class="aspect-square"
      :class="
        $attrs.class
          ? $attrs.class
          : '' + noBorder
            ? ''
            : ' outline outline-1 outline-offset-[-1px] outline-label-separator'
      "
    />
  </div>
</template>
