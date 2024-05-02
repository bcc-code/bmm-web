<script lang="ts" setup>
import { useAuth0 } from "@auth0/auth0-vue";

const props = defineProps<{
  src: string;
  alt?: string | undefined;
}>();

const source = ref<string>("");
const { getAccessTokenSilently } = useAuth0();

source.value = authorizedUrl(props.src, await getAccessTokenSilently());

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
  <FadeInImage :src="source" :alt="alt" />
</template>
