<script lang="ts" setup>
import filters from "@/utils/filters";
import { useAuth0 } from "@auth0/auth0-vue";
import { onMounted, ref } from "vue";

const props = defineProps<{
  src: string;
}>();

const source = ref("");

const { getAccessTokenSilently } = useAuth0();

onMounted(async () => {
  const token = await getAccessTokenSilently();

  // TODO: placeholder image url
  source.value = filters.authorizedUrl(props.src, token);
});
</script>
<template>
  <img :src="source" />
</template>
