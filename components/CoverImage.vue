<script lang="ts" setup>
defineProps<{
  src?: string | undefined | null;
  alt?: string;
  noBorder?: boolean;
}>();
</script>
<template>
  <div class="bg-background-2 aspect-square">
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
            : ' outline outline-label-separator outline-1 outline-offset-[-1px]'
      "
    />
  </div>
</template>
