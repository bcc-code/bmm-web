<script lang="ts" setup>
import filters from "@/utils/filters";
import { AUTH0_INJECTION_KEY } from "@auth0/auth0-vue";
import { watch, ref, inject } from "vue";

const props = defineProps<{
  src: string;
}>();

const source = ref("");

const { getAccessTokenSilently } = inject(AUTH0_INJECTION_KEY)!;

watch(
  () => props.src,
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
