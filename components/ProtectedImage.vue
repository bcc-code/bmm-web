<script lang="ts" setup>
import { useAuth0 } from "@auth0/auth0-vue";

const props = defineProps<{
  src: string;
  alt?: string;
  noBorder?: boolean;
}>();

const source = ref<string>("");
const { getAccessTokenSilently } = useAuth0();

watch(
  () => props.src,
  async () => {
    const token = await getAccessTokenSilently();
    source.value = authorizedUrl(props.src, token);
  },
  { immediate: true },
);
</script>
<template>
  <img
    :src="source"
    :alt="alt || ''"
    loading="lazy"
    :class="
      noBorder
        ? ''
        : 'outline outline-label-separator outline-1 outline-offset-[-1px]'
    "
  />
</template>
