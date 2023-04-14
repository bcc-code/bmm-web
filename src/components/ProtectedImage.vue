<script lang="ts" setup>
import filters from "@/utils/filters";
import { useAuth0 } from "@auth0/auth0-vue";
import { watch, ref } from "vue";

const props = defineProps<{
  src: string;
}>();

const source = ref("");

const { getAccessTokenSilently } = useAuth0();

watch(
  props,
  async () => {
    const token = await getAccessTokenSilently();

    source.value = filters.authorizedUrl(props.src, token);
  },
  { immediate: true }
);
</script>
<template>
  <img :src="source" />
</template>
