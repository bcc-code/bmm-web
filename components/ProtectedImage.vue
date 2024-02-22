<script lang="ts" setup>
import { useAuth0 } from "@auth0/auth0-vue";

const props = defineProps<{
  src: string;
  alt?: string | undefined;
}>();

const source = ref<string>("");
const { getAccessTokenSilently } = useAuth0();

watch(
  () => props.src,
  async () => {
    if (props.src) {
      const token = await getAccessTokenSilently();
      source.value = authorizedUrl(props.src, token);
    }
  },
  { immediate: true },
);
</script>
<template>
  <img :src="source" :alt="alt || ''" loading="lazy" />
</template>
